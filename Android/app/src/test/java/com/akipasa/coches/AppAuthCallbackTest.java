package com.akipasa.coches;

import org.junit.Test;
import static org.junit.Assert.*;

public class AppAuthCallbackTest {
    @Test public void mapsOnlyToOwnFixedOriginWithNativeMarkers() {
        String result = AppAuthCallback.toWebUrl("akicoches://auth/callback?locale=en&code=one%2Btwo&next=%2Fen%2Faccount");
        assertEquals("https://akicoches.com/en/auth/callback?android=1&native=1&code=one%2Btwo&next=%2Fen%2Faccount", result);
        assertTrue(AppAuthCallback.toWebUrl("akicoches://auth/callback?code=abc").startsWith("https://akicoches.com/es/auth/callback?android=1&native=1"));
    }
    @Test public void cancellationReturnsToOwnWebCallback() {
        assertTrue(AppAuthCallback.toWebUrl("akicoches://auth/callback?locale=es&error=access_denied&error_description=Cancelled%20by%20user").contains("error=access_denied&error_description=Cancelled+by+user"));
    }
    @Test public void rejectsCrossAppAndAmbiguousOrTokenCallbacks() {
        for (String value : new String[]{
            "otherapp://auth/callback?code=abc", "akicoches://evil/callback?code=abc",
            "akicoches://auth/callback/extra?code=abc", "akicoches://user@auth/callback?code=abc",
            "akicoches://auth:443/callback?code=abc", "akicoches://auth/callback?code=abc#access_token=secret",
            "akicoches://auth/callback?code=abc&code=second", "akicoches://auth/callback?code=abc&access_token=secret",
            "akicoches://auth/callback?code=abc&redirect=https%3A%2F%2Fevil.example", "akicoches://auth/callback?locale=en",
            "akicoches://auth/callback?code=", "akicoches://auth/callback?code=%ZZ", "akicoches://auth/%63allback?code=abc"}) assertNull(value, AppAuthCallback.toWebUrl(value));
        assertNull(AppAuthCallback.toWebUrl(null));
        assertNull(AppAuthCallback.toWebUrl("akicoches://auth/callback?code=" + "x".repeat(9000)));
    }
}
