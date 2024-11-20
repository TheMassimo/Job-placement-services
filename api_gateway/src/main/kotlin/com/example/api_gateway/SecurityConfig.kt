package com.example.api_gateway

import jakarta.servlet.FilterChain
import jakarta.servlet.ServletException
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter
import org.springframework.security.web.csrf.*
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter
import java.io.IOException
import java.util.function.Supplier

@Configuration
@EnableWebSecurity
class SecurityConfig(val crr:ClientRegistrationRepository) {

    fun oidcLogoutSuccessHandler() = OidcClientInitiatedLogoutSuccessHandler(crr)
        .also{ it.setPostLogoutRedirectUri("http://localhost:8080/" )} //${serverPort}

    @Bean
    fun securityFilterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
        return httpSecurity
            .authorizeHttpRequests {
                it.requestMatchers("/ui", "/login", "/logout").permitAll()
                it.anyRequest().authenticated()
            }
            .csrf{it.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                it.csrfTokenRequestHandler(SpaCsrfTokenRequestHandler()) }
            .addFilterAfter(CsrfCookieFilter(), BasicAuthenticationFilter::class.java)
            .oauth2Login{}
            .logout {it.logoutSuccessHandler(oidcLogoutSuccessHandler()) }
            .build()
    }
}

class SpaCsrfTokenRequestHandler : CsrfTokenRequestAttributeHandler() {
    private val delegate: CsrfTokenRequestHandler = CsrfTokenRequestAttributeHandler()

    override fun handle(req: HttpServletRequest, res: HttpServletResponse, t: Supplier<CsrfToken>) {
        delegate.handle(req, res, t)
    }

    override fun resolveCsrfTokenValue(request: HttpServletRequest, csrfToken: CsrfToken): String? {
        val d = csrfToken as DefaultCsrfToken
        return if (StringUtils.hasText(request.getHeader(csrfToken.headerName))) {
            super.resolveCsrfTokenValue(request, csrfToken)
        } else {
            delegate.resolveCsrfTokenValue(request, csrfToken)
        }
    }
}

class CsrfCookieFilter: OncePerRequestFilter() {
    @Throws(ServletException::class, IOException::class)
    override fun doFilterInternal(req: HttpServletRequest, res: HttpServletResponse, filterChain: FilterChain) {
        val csrfToken = req.getAttribute("_csrf") as CsrfToken
        csrfToken.token
        filterChain.doFilter(req, res)
    }
}


//it.requestMatchers("/", "/login", "/logout").permitAll()
//it.requestMatchers("/secure").authenticated()
//it.requestMatchers("/anon").anonymous()
//it.requestMatchers("/prova")
//it.requestMatchers("/ui/**").permitAll()

