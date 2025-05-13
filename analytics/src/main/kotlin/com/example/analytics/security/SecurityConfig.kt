package com.example.analytics.security

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.http.HttpMethod
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.security.web.csrf.CookieCsrfTokenRepository
import org.springframework.security.web.csrf.CsrfToken
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler
import org.springframework.security.web.csrf.CsrfTokenRequestHandler
import org.springframework.util.StringUtils
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException
import java.util.function.Supplier
import org.springframework.web.cors.UrlBasedCorsConfigurationSource
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.filter.CorsFilter

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter
import org.springframework.security.oauth2.jwt.Jwt


@Configuration
class GlobalCorsConfig {
    @Bean
    fun corsFilter(): CorsFilter {
        val source = UrlBasedCorsConfigurationSource()
        val config = CorsConfiguration().apply {
            allowedOriginPatterns = listOf("http://localhost:*", "http://*.anotherdomain.com") // Pattern con wildcard
            allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed methods
            allowedHeaders = listOf("Content-Type", "Authorization", "X-XSRF-TOKEN") // Include X-XSRF-TOKEN
            exposedHeaders = listOf("X-XSRF-TOKEN") // Expose headers to frontend
            allowCredentials = true // Allow cookies and credentials
        }
        source.registerCorsConfiguration("/**", config)
        return CorsFilter(source)
    }
}



@Configuration
@EnableWebSecurity
class SecurityConfig {


    @Bean
    fun securityFilterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
        return httpSecurity
            .cors { } // Enable CORS configuration
            .authorizeHttpRequests {
                /* ApiGateway Server end-points */
                it.requestMatchers(HttpMethod.GET, "/API/**").hasAnyRole("manager")
                //it.requestMatchers(HttpMethod.POST, "/API/**").hasAnyRole("manager", "recruiter")
                //it.requestMatchers(HttpMethod.DELETE, "/API/**").hasRole("manager")


                /* Other end-points */
                it.anyRequest().permitAll()
            }
            .oauth2Login { }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt { jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()) }
            }            .csrf {
                //it.ignoringRequestMatchers("/crm/api/messages")
                it.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                it.csrfTokenRequestHandler(SpaCsrfTokenRequestHandler())
                //it.ignoringRequestMatchers("/logout")

            }
            .addFilterAfter(CsrfCookieFilter(), BasicAuthenticationFilter::class.java)
            .build()
    }

    @Bean
    fun jwtAuthenticationConverter(): JwtAuthenticationConverter {
        val converter = JwtAuthenticationConverter()
        converter.setJwtGrantedAuthoritiesConverter(CustomJwtRoleConverter())
        return converter
    }



}


class CsrfCookieFilter : OncePerRequestFilter() {
    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(req: HttpServletRequest, res: HttpServletResponse, filterChain: FilterChain) {
        try {
            val csrfToken = req.getAttribute("_csrf") as CsrfToken
            csrfToken.token
            filterChain.doFilter(req, res)
        } catch (e: Exception) {
            val message = e.message!!
            val regex = Regex("HTTP response code: (\\d{3})")
            val match = regex.find(message)
            val tmp = if (match != null) match.groupValues[0] else "HTTP response code: 500"

            val code = tmp.slice(tmp.length - 3..<tmp.length).toLong()

            when (code) {
                400L -> {
                    res.status = 400
                }

                401L -> {
                    res.status = 401
                }

                403L -> {
                    res.status = 403
                }

                500L -> {
                    res.status = 500
                }
            }
        }
    }
}

class SpaCsrfTokenRequestHandler : CsrfTokenRequestAttributeHandler() {
    private val delegate: CsrfTokenRequestHandler = CsrfTokenRequestAttributeHandler()

    override fun handle(req: HttpServletRequest, res: HttpServletResponse, t: Supplier<CsrfToken>) {
        delegate.handle(req, res, t)
    }

    override fun resolveCsrfTokenValue(request: HttpServletRequest, csrfToken: CsrfToken): String? {
        return if (StringUtils.hasText(request.getHeader(csrfToken.headerName))) {
            super.resolveCsrfTokenValue(request, csrfToken)
        } else {
            delegate.resolveCsrfTokenValue(request, csrfToken)
        }
    }
}


class CustomJwtRoleConverter : Converter<Jwt, Collection<GrantedAuthority>> {
    override fun convert(jwt: Jwt): Collection<GrantedAuthority> {
        val authorities = mutableListOf<GrantedAuthority>()

        // Extract "realm_access.roles"
        val realmRoles = jwt.getClaimAsMap("realm_access")?.get("roles") as? Collection<String> ?: emptyList()
        authorities.addAll(realmRoles.map { SimpleGrantedAuthority("ROLE_$it") })

        // Extract "resource_access.CRMclient.roles"
        val resourceRoles = (jwt.getClaimAsMap("resource_access")?.get("CRMclient") as? Map<*, *>)?.get("roles") as? Collection<String> ?: emptyList()
        authorities.addAll(resourceRoles.map { SimpleGrantedAuthority("ROLE_$it") })

        return authorities
    }
}


