/*
package com.example.document_store.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain


@Configuration
@EnableWebSecurity
class SecurityConfig(private val jwtAuthConverter: JwtAuthConverter) {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        return http
            .authorizeHttpRequests {
                it.requestMatchers(HttpMethod.GET, "/API/documents").hasAnyAuthority("ROLE_manager", "ROLE_operator", "ROLE_guest")
                it.requestMatchers(HttpMethod.GET, "/API/documents/{id}").hasAnyAuthority("ROLE_manager", "ROLE_operator", "ROLE_guest")
                it.requestMatchers(HttpMethod.GET, "/API/documents/{id}/data").hasAnyAuthority("ROLE_manager", "ROLE_operator", "ROLE_guest")
                it.requestMatchers(HttpMethod.POST, "/API/documents").hasAnyAuthority("ROLE_manager", "ROLE_operator")
                it.requestMatchers(HttpMethod.PUT, "/API/documents/{id}").hasAnyAuthority("ROLE_manager", "ROLE_operator")
                it.requestMatchers(HttpMethod.DELETE, "/API/documents/{id}").hasAnyAuthority("ROLE_manager")

                //it.anyRequest().denyAll()
                it.anyRequest().permitAll()
            }
            .oauth2ResourceServer {
                it.jwt { jwtConfigurer ->
                    jwtConfigurer.jwtAuthenticationConverter(jwtAuthConverter)
                }
            }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .csrf { it.disable() }
            .cors { it.disable() }
            //.formLogin { it.disable() } per ora è commentato, poi con il frontend si può disabilitare
            .build()
    }

}
*/
package com.example.document_store.security

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        return http
            .cors { it.configurationSource(corsConfigurationSource()) } // ✅ Abilita CORS correttamente
            .csrf { it.disable() } // ✅ Disabilita CSRF per API REST
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { it.anyRequest().permitAll() } // ✅ Accesso aperto a tutti
            .build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:5173") // ✅ Specifica l'origine frontend
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}
