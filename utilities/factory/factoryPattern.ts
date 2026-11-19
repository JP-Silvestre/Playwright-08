export interface LoginCredentials {
  usernames: Record<UserType, string>;
  password: string;
}


export interface User {
  readonly username: string;
  readonly password: string;
}

export type UserType = 'standard' | 'locked_out' | 'problem' | 'performance_glitch' | 'error' | 'visual';



export abstract class UserFactory {

  abstract createUser(credentials: LoginCredentials): User;

  protected build(credentials: LoginCredentials, username: string): User {

    if (!username) {
      throw new Error('A username is missing from the login credentials.');
    }
    return { username, password: credentials.password };
  }
}

class StandardUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, c.usernames.standard); }
}

class LockedOutUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, c.usernames.locked_out); }
}

class ProblemUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, c.usernames.problem); }
}
class PerformanceGlitchUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, c.usernames.performance_glitch); }
}

class ErrorUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, c.usernames.error); }
}

class VisualUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, c.usernames.visual); }
}

const factories: Record<UserType, UserFactory> = {

  standard: new StandardUserFactory(),
  locked_out: new LockedOutUserFactory(),
  problem: new ProblemUserFactory(),
  performance_glitch: new PerformanceGlitchUserFactory(),
  error: new ErrorUserFactory(),
  visual: new VisualUserFactory(),

};



export function createUser(type: UserType, credentials: LoginCredentials): User {

  return factories[type].createUser(credentials);
  
}

export function readCredentialsFromEnv(): LoginCredentials {
  const envNames: Record<UserType, string> = {
    standard: 'APP_STANDARD_USERNAME',
    locked_out: 'APP_LOCKED_OUT_USERNAME',
    problem: 'APP_PROBLEM_USERNAME',
    performance_glitch: 'APP_PERFORMANCE_GLITCH_USERNAME',
    error: 'APP_ERROR_USERNAME',
    visual: 'APP_VISUAL_USERNAME',
  };
  const usernames = Object.fromEntries(
    Object.entries(envNames).map(([type, envName]) => [type, process.env[envName]?.trim()]),
  ) as Record<UserType, string | undefined>;
  const missing = Object.entries(envNames)
    .filter(([type]) => !usernames[type as UserType])
    .map(([, envName]) => envName);
  const password = process.env.PASSWORD?.trim();

  if (!password) missing.push('PASSWORD');
  if (missing.length > 0) {
    throw new Error(`Missing credentials in .env: ${missing.join(', ')}`);
  }

  return { usernames: usernames as Record<UserType, string>, password: password! };
}

 
