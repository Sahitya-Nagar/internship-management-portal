# Separate Login URLs for Each User Type

The application has isolated login pages for each user type with enhanced security through obscurity.

## Login URLs

### Student Login (Default)
- **URL:** http://localhost:5173 or http://localhost:5173/login or http://localhost:5173/login/student
- **Access:** Only students can log in through this portal
- **Error Message:** "Access denied. This login portal is for students only."
- **Note:** This is the default landing page

### Employer Login
- **URL:** http://localhost:5173/login/employer
- **Access:** Only employers can log in through this portal
- **Error Message:** "Access denied. This login portal is for employers only."
- **Note:** This URL should be shared only with employers

### Supervisor Login
- **URL:** http://localhost:5173/login/supervisor
- **Access:** Only supervisors can log in through this portal
- **Error Message:** "Access denied. This login portal is for supervisors only."
- **Note:** This URL should be shared only with supervisors

### Administrator Login
- **URL:** http://localhost:5173/login/admin
- **Access:** Only administrators can log in through this portal
- **Error Message:** "Access denied. This login portal is for administrators only."
- **Note:** This URL should be shared only with administrators

## Security Features

1. **Role-based URL separation:** Each user type has a dedicated login URL
2. **No portal discovery:** There is no portal selector page; users must know the correct URL for their role
3. **Role verification:** The system verifies that the user's role matches the login portal they're using
4. **Access denial:** Users attempting to log in through the wrong portal receive a clear error message
5. **No cross-portal navigation:** Login pages do not link to other portals
6. **Security through obscurity:** Non-student portal URLs are not publicly discoverable

## Files Modified

- `client/src/App.jsx` - Changed default `/login` route to StudentLogin instead of portal selector
- `client/src/pages/LoginStudent.jsx` - Removed back link to portal selector
- `client/src/pages/LoginEmployer.jsx` - Removed back link to portal selector
- `client/src/pages/LoginSupervisor.jsx` - Removed back link to portal selector
- `client/src/pages/LoginAdmin.jsx` - Removed back link to portal selector
- `client/src/pages/Login.jsx` - Portal selector page (not used in routes)

## How to Use

1. Students navigate to http://localhost:5173 (default landing page)
2. Employers must know and use http://localhost:5173/login/employer
3. Supervisors must know and use http://localhost:5173/login/supervisor
4. Administrators must know and use http://localhost:5173/login/admin
5. Each portal validates that only the correct user type can access it

## Distribution Strategy

- **Students:** Share the main URL (http://localhost:5173)
- **Employers:** Privately share http://localhost:5173/login/employer
- **Supervisors:** Privately share http://localhost:5173/login/supervisor
- **Administrators:** Privately share http://localhost:5173/login/admin

## Running the Application

Both the server and client are currently running:
- **Client:** http://localhost:5173
- **Server:** http://localhost:5000
- **API Endpoint:** http://localhost:5000/api
