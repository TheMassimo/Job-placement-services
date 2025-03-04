package com.example.api_gateway

import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtDecoders
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken


@RestController
@RequestMapping
class HomeController(    private val authorizedClientService: OAuth2AuthorizedClientService
) {




    fun getJwtToken(authentication: Authentication?): String? {
        println("Authentication object: $authentication")

        return when (authentication) {
            is JwtAuthenticationToken -> {
                println("Access Token found: ${authentication.token.tokenValue}")
                authentication.token.tokenValue
            }
            is OAuth2AuthenticationToken -> {
                val accessToken = authorizedClientService.loadAuthorizedClient<OAuth2AuthorizedClient>(
                    authentication.authorizedClientRegistrationId,
                    authentication.name
                )?.accessToken?.tokenValue
                println("Access Token: $accessToken")
                accessToken
            }
            else -> null
        }
    }



    fun extractRolesFromToken(token: String?): List<String> {
        if (token.isNullOrBlank()) {
            println("Token is null or blank.")
            return emptyList()
        }

        val issuerUri = "http://localhost:9090/realms/CRM"
        val jwtDecoder: JwtDecoder = JwtDecoders.fromIssuerLocation(issuerUri)

        return try {
            val jwt: Jwt = jwtDecoder.decode(token)


            // Extract roles from different claim locations
            val roles: List<String> = jwt.getClaimAsStringList("roles")
                ?: (jwt.claims["realm_access"] as? Map<*, *>)?.get("roles") as? List<String>
                ?: (jwt.claims["resource_access"] as? Map<*, *>)?.get("your-client-id")?.let {
                    (it as? Map<*, *>)?.get("roles") as? List<String>
                }
                ?: emptyList()

            roles
        } catch (ex: Exception) {
            println("Error decoding JWT: ${ex.message}")
            emptyList()
        }
    }


    // From slides: The OAuth2 client should offer URL/login-options returns a JSON list of IAM URLs,
    // to be contacted to perform the login
    @GetMapping("/login-options")
    fun loginOptions(): String? {
        return null
    }

    @GetMapping("/current-user")
    fun currentUser(
        @CookieValue(name = "XSRF-TOKEN", required = false)
        xsrfToken: String?,
        authentication: Authentication?
    ): Map<String, Any?> {
        println("Authentication: $authentication")
        println("Principal: ${authentication?.principal}")

        val principal: OidcUser? = authentication?.principal as? OidcUser
        val username = principal?.preferredUsername ?: ""
        val name = principal?.givenName ?: ""
        val surname = principal?.familyName ?: ""
        val email = principal?.email ?: ""



        val token = getJwtToken(authentication)
        val allRoles = extractRolesFromToken(token)
        val roles = allRoles.filter { it.contains("operator") || it.contains("manager") || it.contains("recruiter") }

        return mapOf(
            "username" to username,
            "roles" to roles,

            "name" to name,
            "surname" to surname,
            "email" to email,
            "loginUrl" to "/oauth2/authorization/CRMclient",
            "logoutUrl" to "/logout",
            "principal" to principal,
            "xsrfToken" to xsrfToken,
        )
    }


    @GetMapping("/secure")
    fun getDetails(
        authentication: Authentication?
    ): Map<String, Any?> {
        val oAuth2Authentication = authentication as OAuth2AuthenticationToken

        val principal = oAuth2Authentication.principal as OAuth2AuthenticatedPrincipal

        val clientRoles = principal.getAttribute<List<String>>("client_roles")
        val roles = principal.getAttribute<List<String>>("roles")

        var allRoles = (clientRoles ?: emptyList()) + (roles ?: emptyList())
        allRoles = allRoles.filter { it.contains("operator") || it.contains("manager") || it.contains("guest") }

        return mapOf(
            "principal" to principal,
            "roles" to allRoles
        )
    }
}
