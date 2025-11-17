# Organization Invitation System

## Overview
This document describes the implementation of the organization invitation system that allows users to accept invitations via email links.

## Flow

### 1. Invitation Link Format
```
http://localhost:3000/accept-invite?invite=<inviteCode>&email=<email>&org=<orgId>
```

### 2. User States and Behaviors

#### A. User is Already Logged In
1. System checks if logged-in user's email matches the invitation email
2. **If emails match**: User can accept the invitation
3. **If emails don't match**: User is redirected to home page with an error message

#### B. User is NOT Logged In
1. System stores invitation data (inviteCode, email, org) in Redux state
2. User is redirected to login page (/)
3. Email field is pre-filled and made read-only
4. User can either:
   - Sign in with password
   - Create a new account
   - Sign in with Google (must use the invited email)

### 3. Post-Authentication
Once authenticated (via any method), user is redirected to `/accept-invite` page where they can:
- View the invitation details
- Click "Accept Invitation" button to join the organization
- After acceptance, redirected to dashboard

## Implementation Details

### Files Created

#### 1. `/lib/slices/invite-slice.ts`
Redux slice for managing invitation state:
- `inviteCode`: The invitation code
- `email`: The invited email address
- `org`: The organization ID
- Actions: `setInviteData`, `clearInviteData`

#### 2. `/app/accept-invite/page.tsx`
Main page for accepting invitations:
- Validates invitation parameters
- Checks email match for logged-in users
- Handles both regular auth and Google OAuth
- Provides accept/cancel actions
- Clears invite data on page refresh

#### 3. `/api/organization.ts` (Updated)
Added `acceptInvitation` API function:
```typescript
export const acceptInvitation = async (payload: { inviteCode: string })
```

### Files Modified

#### 1. `/lib/store.ts`
- Added `inviteReducer` to the root reducer
- Invite state is NOT persisted (cleared on refresh)

#### 2. `/app/page.tsx` (Login Page)
- Pre-fills email from invite state
- Makes email field read-only during invite flow
- Redirects to accept-invite page after successful login
- Shows informational alert when in invite flow
- Handles Google login with invite callback

#### 3. `/app/register/page.tsx`
- Pre-fills email from invite state
- Makes email field read-only during invite flow
- Redirects to accept-invite page after successful registration
- Shows informational alert when in invite flow
- Handles Google registration with invite callback

## Redux State Management

### Invite Slice State
```typescript
{
  inviteCode: string | null;
  email: string | null;
  org: string | null;
}
```

### State Clearing
The invite state is cleared:
1. When page is refreshed (beforeunload event)
2. After successful invitation acceptance

## User Experience Features

1. **Email Pre-filling**: Email is automatically filled from invitation
2. **Read-only Email**: Users cannot change the email during invite flow
3. **Visual Indicators**: Blue alert showing invitation context
4. **Email Validation**: System ensures only the invited email can accept
5. **Google Auth Support**: Seamless integration with Google OAuth
6. **Error Handling**: Clear error messages for mismatched emails
7. **Loading States**: Proper loading indicators during validation

## Security Features

1. **Email Verification**: Only the invited email can accept the invitation
2. **Session Validation**: Both regular auth and Google OAuth are validated
3. **State Cleanup**: Invite data is cleared on refresh to prevent replay
4. **Backend Validation**: Final validation happens on the server

## API Endpoint

### Accept Invitation
```typescript
POST /organizations/accept-invitation
Body: { inviteCode: string }
```

## Testing Scenarios

1. **Logged-in user with matching email**: Should see accept page immediately
2. **Logged-in user with different email**: Should see error and redirect to home
3. **Not logged-in user**: Should redirect to login with pre-filled email
4. **Google login with matching email**: Should successfully authenticate and show accept page
5. **Google login with different email**: Should show error message
6. **Page refresh during invite flow**: Should clear invite state and redirect

## Future Enhancements

1. Add invitation expiry validation
2. Add organization name display on accept page
3. Add ability to decline invitations
4. Add invitation history for users
5. Add email notification after acceptance


