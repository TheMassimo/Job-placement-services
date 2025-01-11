package com.example.api_gateway

import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal
import org.springframework.security.oauth2.core.oidc.user.OidcUser
import org.springframework.web.bind.annotation.CookieValue
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping
class HomeController {
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

        val clientRoles = principal?.getAttribute<List<String>>("client_roles")
        val roles = principal?.getAttribute<List<String>>("roles")

        val allRoles = (clientRoles ?: emptyList()) + (roles ?: emptyList())

        return mapOf(
            "username" to username,
            "name" to name,
            "surname" to surname,
            "email" to email,
            "loginUrl" to "/oauth2/authorization/CRMclient",
            "logoutUrl" to "/logout",
            "principal" to principal,
            "xsrfToken" to xsrfToken,
            "roles" to allRoles.filter { it.contains("operator") || it.contains("manager") || it.contains("recruiter") }
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
