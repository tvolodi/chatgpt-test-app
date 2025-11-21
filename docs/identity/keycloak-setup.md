# Keycloak Setup Guide - Automated Import

This guide explains the automated Keycloak configuration for the AI-Dala web application.

## Automated Setup

The Keycloak realm and client are now automatically imported on container startup via `keycloak/realm-export.json`.

### What's Configured

The realm export automatically creates:

- **Realm**: `ai-dala-realm`
- **Client**: `webapp` (public client with PKCE)
- **Test User**: `testuser` / `test123`
- **Login Features**:
  - ✅ User registration enabled
  - ✅ Forgot password enabled
  - ✅ Remember me enabled

### Quick Start

1. Start the Keycloak container:
   ```powershell
   docker-compose up -d keycloak
   ```

2. Wait for Keycloak to initialize (~30 seconds)

3. Verify the setup:
   - Open [http://localhost:8080](http://localhost:8080)
   - Login with `admin` / `admin`
   - Select `ai-dala-realm` from the dropdown
   - Verify the `webapp` client exists

### Applying Configuration Changes

If you modify `keycloak/realm-export.json`, restart the container:

```powershell
./scripts/setup-keycloak.ps1
```

Or manually:

```powershell
docker-compose up -d --force-recreate keycloak
```

## Manual Setup (Legacy)

For manual setup instructions, see the original guide below.

---

# Keycloak Setup Guide - Public Client (Manual)

This guide walks you through configuring Keycloak for the AI-Dala web application using a **public client** (no client secret).

## Prerequisites

- Keycloak running at `http://localhost:8080`
- Admin credentials: `admin/admin`

## Step 1: Access Keycloak Admin Console

1. Open browser and navigate to `http://localhost:8080`
2. Click **Administration Console**
3. Login with username `admin` and password `admin`

## Step 2: Create Realm

1. Click the dropdown in the top-left (currently shows "master")
2. Click **Create Realm**
3. Enter realm name: `ai-dala-realm`
4. Click **Create**

## Step 2.1: Enable User Registration

1. In the left sidebar, click **Realm settings**
2. Go to the **Login** tab
3. Enable the following:
   - ✅ **User registration** (allows new users to sign up)
   - ✅ **Forgot password** (optional, but recommended)
   - ✅ **Remember me** (optional)
   - ✅ **Verify email** (optional, but recommended for production)
4. Click **Save**

> [!NOTE]
> With **User registration** enabled, the Keycloak login page will display a "Register" link that allows new users to create accounts.

## Step 3: Create Client

1. In the left sidebar, click **Clients**
2. Click **Create client**
3. Configure:
   - **Client type**: OpenID Connect
   - **Client ID**: `webapp`
   - Click **Next**

4. **Capability config**:
   - **Client authentication**: **OFF** ✅ (This makes it a public client)
   - **Authorization**: OFF
   - **Authentication flow**:
     - ✅ Standard flow
     - ✅ Direct access grants
   - Click **Next**

5. **Login settings**:
   - **Root URL**: `http://localhost:3000`
   - **Home URL**: `http://localhost:3000`
   - **Valid redirect URIs**: `http://localhost:3000/*`
   - **Valid post logout redirect URIs**: `http://localhost:3000/*`
   - **Web origins**: `http://localhost:3000`
   - Click **Save**

## Step 4: Verify Configuration

1. Go to **Clients** → **webapp**
2. Check the **Settings** tab:
   - **Client authentication** should be **OFF**
   - **Standard flow** should be **enabled**
3. Go to **Advanced** tab:
   - **Proof Key for Code Exchange Code Challenge Method**: S256 (should be set automatically)

## Step 5: Create Test User

1. In the left sidebar, click **Users**
2. Click **Add user**
3. Enter:
   - **Username**: `testuser`
   - **Email**: `test@ai-dala.com`
   - **First name**: Test
   - **Last name**: User
   - **Email verified**: ON
4. Click **Create**
5. Go to **Credentials** tab
6. Click **Set password**
7. Enter password: `test123` (or your choice)
8. Set **Temporary** to **OFF**
9. Click **Save**

## Step 6: Test the Configuration

### Test Login Flow
1. Restart your Next.js dev server (if it's running):
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`
3. Click **Sign In with Keycloak**
4. You should be redirected to Keycloak login page
5. Login with `testuser` / `test123`
6. You should be redirected back to your application

### Test Registration Flow
1. Navigate to `http://localhost:3000/login`
2. Click **Sign In with Keycloak**
3. On the Keycloak login page, click **Register** (at the bottom)
4. Fill in the registration form:
   - Email: `newuser@example.com`
   - Username: `newuser`
   - First name: New
   - Last name: User
   - Password: `password123`
   - Confirm password: `password123`
5. Click **Register**
6. You should be automatically logged in and redirected to your application

## Troubleshooting

### "Invalid redirect_uri"
- Check that **Valid redirect URIs** includes `http://localhost:3000/*`
- Check that **Web origins** includes `http://localhost:3000`

### "Client authentication failed"
- Verify **Client authentication** is set to **OFF**
- Check that you removed `KEYCLOAK_CLIENT_SECRET` from `.env.local`

### "Invalid parameter: code_challenge_method"
- This means PKCE is not enabled
- Check **Advanced** tab → **Proof Key for Code Exchange Code Challenge Method** is set to **S256**

## Configuration Summary

```yaml
Realm: ai-dala-realm
Client ID: webapp
Client Type: Public (Client Authentication OFF)
Authentication Flow: Standard flow + Direct access grants
PKCE: Enabled (S256)
Redirect URIs: http://localhost:3000/*
Web Origins: http://localhost:3000
```
