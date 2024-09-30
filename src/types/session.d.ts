import 'express-session';

declare module 'express-session' {
  interface SessionData {
    jwt: string; // Add jwt as part of the session data
  }
}
