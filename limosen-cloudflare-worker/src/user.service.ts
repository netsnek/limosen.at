// services/user.service.ts

import { getContext, getEnv, requireAuth } from "@getcronit/pylon";
import validator from "validator";
import { InvalidInputError } from "./errors/general.errors";
import { EmailOrUsernameAlreadyExistsError, UserNotFoundError } from "./errors/user.errors";

// --------------------------------------------------
// Example interfaces for ZITADEL list users response
// --------------------------------------------------
export interface GetAllUsersResponse {
  details: {
    totalResult: string;       // e.g. "345"
    viewTimestamp: string;     // e.g. "2025-01-17T04:43:59.432613Z"
  };
  result: ZitadelUser[];
}

interface ZitadelUser {
  id: string;
  details: {
    sequence: string;
    creationDate: string;
    changeDate: string;
    resourceOwner: string;
  };
  state: string;                // e.g. "USER_STATE_INITIAL"
  userName: string;
  loginNames: string[];
  preferredLoginName: string;
  human?: HumanUser;            // Might be undefined if user is not "human"
}

/**
 * Contains human-specific attributes (profile, email, phone).
 */
export interface HumanUser {
  profile?: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    preferredLanguage?: string;
  };
  email?: {
    email?: string;
  };
  phone?: Record<string, any>;  // Adjust if you know the exact phone fields
}

// --------------------------------------------------
// Existing user creation response interface
// --------------------------------------------------
interface UserCreateResponse {
  userId: string;
  details: {
    sequence: string;
    creationDate: string;
    resourceOwner: string;
  };
}

export class UserService {
  @requireAuth()
  static async user() {
    const auth = getContext().get("auth");
    if (!auth.sub) {
      throw new UserNotFoundError("Anonymous");
    }
    return auth.sub;
  }
  
  static async getIsUnique(loginName: string): Promise<boolean | null> {
    const env: any = getEnv();
    const apiKey = env?.ORG_USER_MANAGER_TOKEN ?? 'API_KEY';
    let url = "";

    try {
      if (validator.isEmail(loginName) === true) {
        url = `${env?.AUTH_ISSUER}/management/v1/users/_is_unique?email=${loginName}`;
      } else if (validator.isAlphanumeric(loginName) === true) {
        url = `${env?.AUTH_ISSUER}/management/v1/users/_is_unique?userName=${loginName}`;
      }

      if (!url) {
        throw new InvalidInputError("Invalid email/username format");
      }

      const response: Response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        throw new InvalidInputError(
          data?.message || "Something has gone Wrong"
        );
      }

      return data?.isUnique ? true : false;
    } catch (e) {
      console.error(e);
      handleUserServiceError(e);
      throw e;
    }
  }

  static async userCreate(
    values: {
      emailAddress: string;
      username: string;
      password?: string;
      hashedPassword?: string;
      details?: {
        firstName?: string;
        lastName?: string;
      };
    },
    organizationId?: string,
    createProfile?: boolean,
    skipEmailVerification?: boolean
  ): Promise<UserCreateResponse> {
    const env: any = getEnv();
    const emailAddress = values.emailAddress.toLowerCase();
    const username = values.username.toLowerCase();

    let isActive: boolean;
    if (skipEmailVerification) {
      // If skipEmailVerification is true => user is active immediately
      isActive = true;
    } else {
      // If skipEmailVerification is false => user remains inactive until verification
      isActive = false;
    }

    const url = `${env?.AUTH_ISSUER}/management/v1/users/human/_import`;
    const apiKey = env?.ORG_USER_MANAGER_TOKEN ?? 'API_KEY';

    try {
      if (
        !(await UserService.getIsUnique(username)) ||
        !(await UserService.getIsUnique(emailAddress))
      ) {
        throw new EmailOrUsernameAlreadyExistsError(
          `${username} <${emailAddress}>`
        );
      }

      const response: Response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(organizationId ? { 'x-zitadel-orgid': organizationId } : {}),
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          userName: values.username,
          profile: {
            firstName: values.details?.firstName ?? '',
            lastName: values.details?.lastName ?? '',
            preferredLanguage: 'en',
          },
          ...(values.hashedPassword
            ? { hashedPassword: { value: values.hashedPassword } }
            : {}),
          email: {
            email: values.emailAddress,
            isEmailVerified: skipEmailVerification || false,
          },
          ...(values.password
            ? {
                password: values.password,
                passwordChangeRequired: false,
              }
            : {}),
        }),
      });

      const data = (await response.json()) as UserCreateResponse;
      if (!response.ok) {
        throw new InvalidInputError(data?.details?.toString() || "Something has gone Wrong");
      }

      return data;
    } catch (e) {
      console.error(e);
      handleUserServiceError(e);
      throw e;
    }
  }

  // --------------------------------------------------
  // NEW: Fetch exactly one user by ID (ZITADEL)
  // --------------------------------------------------
  static async getZitadelUserById(userId: string, organizationId?: string): Promise<ZitadelUser> {
    const env: any = getEnv();
    const apiKey = env?.ORG_USER_MANAGER_TOKEN ?? "API_KEY";
    const url = `${env?.AUTH_ISSUER}/management/v1/users/${encodeURIComponent(userId)}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(organizationId ? { "x-zitadel-orgid": organizationId } : {}),
          Authorization: `Bearer ${apiKey}`,
        },
      });

      const data = (await response.json()) as any;

      if (!response.ok) {
        if (response.status === 404) {
          throw new UserNotFoundError(userId);
        }
        throw new InvalidInputError(data?.message || "Something has gone Wrong");
      }

      // Some ZITADEL endpoints return `{ user: ... }`, others may return the user directly.
      const user = (data?.user ?? data) as ZitadelUser;

      if (!user?.id) {
        throw new InvalidInputError("Malformed user payload");
      }

      return user;
    } catch (e) {
      console.error(e);
      handleUserServiceError(e);
      throw e;
    }
  }

  // --------------------------------------------------
  // NEW: List all (human) users in ZITADEL
  // --------------------------------------------------
  static async listAllZitadelUsers(limit = 100): Promise<ZitadelUser[]> {
    const env: any = getEnv();
    const apiKey = env?.ORG_USER_MANAGER_TOKEN ?? "API_KEY";
    const url = `${env?.AUTH_ISSUER}/management/v1/users/_search`;

    try {
      // POST body can include queries, limit, offset, etc.
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          limit,
          offset: 0,
          // If you'd like to filter, you can add "queries" here.
          // E.g. queries: [{ query: 'your-filter' }]
          //queries: [],
        }),
      });

      if (!response.ok) {
        const errData = (await response.json()) as any;
        throw new InvalidInputError(errData?.message || "Something has gone Wrong");
      }

      const data = (await response.json()) as GetAllUsersResponse;

      // Return the array of users or empty array if undefined
      return data.result ?? [];
    } catch (e) {
      console.error(e);
      handleUserServiceError(e);
      throw e;
    }
  }

  static async getUserCount(): Promise<number> {
    const env: any = getEnv();
    const apiKey = env?.ORG_USER_MANAGER_TOKEN ?? "API_KEY";
    const url = `${env?.AUTH_ISSUER}/management/v1/users/_search`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          limit: 1,
          offset: 0,
        }),
      });

      if (!response.ok) {
        const errData = (await response.json()) as any;
        throw new InvalidInputError(errData?.message || "Something has gone Wrong");
      }

      const data = (await response.json()) as GetAllUsersResponse;

      // Return the total number of users or 0 if undefined
      return parseInt(data.details.totalResult) || 0;
    } catch (e) {
      console.error(e);
      handleUserServiceError(e);
      throw e;
    }
  }
}

function handleUserServiceError(e: unknown) {
  // Adjust error handling logic as needed
  throw e;
}
