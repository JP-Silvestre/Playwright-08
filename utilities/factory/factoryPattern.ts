export interface LoginCredentials {
  usernames: string[];
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

    if (!credentials.usernames.includes(username)) {
      throw new Error(
        `user "${username}" does not appear in login. ` +
          `avalailable: ${credentials.usernames.join(', ')}`,
      );
    }
    return { username, password: credentials.password };
  }
}

class StandardUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, 'standard_user'); }
}

class LockedOutUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, 'locked_out_user'); }
}

class ProblemUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, 'problem_user'); }
}
class PerformanceGlitchUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, 'performance_glitch_user'); }
}

class ErrorUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, 'error_user'); }
}

class VisualUserFactory extends UserFactory {
  createUser(c: LoginCredentials) { return this.build(c, 'visual_user'); }
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

 