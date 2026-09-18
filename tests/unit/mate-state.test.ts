import { describe, it, expect } from "vitest";

type MateApplicationState = "PENDING" | "ACCEPTED" | "REJECTED" | "CLOSED";

interface MateApplication {
  id: string;
  post_id: string;
  user_id: string;
  state: MateApplicationState;
  created_at: string;
}

interface MatePost {
  id: string;
  status: "OPEN" | "CLOSED";
  end_date: string;
}

function transitionApplicationState(
  application: MateApplication,
  action: "accept" | "reject" | "close"
): MateApplication {
  if (action === "accept") {
    if (application.state !== "PENDING") {
      throw new Error("Only PENDING applications can be accepted");
    }
    return { ...application, state: "ACCEPTED" };
  }

  if (action === "reject") {
    if (application.state !== "PENDING") {
      throw new Error("Only PENDING applications can be rejected");
    }
    return { ...application, state: "REJECTED" };
  }

  if (action === "close") {
    return { ...application, state: "CLOSED" };
  }

  throw new Error("Invalid action");
}

function checkDuplicateApplication(
  applications: MateApplication[],
  postId: string,
  userId: string
): boolean {
  return applications.some(
    (app) => app.post_id === postId && app.user_id === userId
  );
}

function updateApplicationStateIfPostClosed(
  application: MateApplication,
  post: MatePost
): MateApplication {
  if (post.status === "CLOSED" && application.state === "PENDING") {
    return { ...application, state: "CLOSED" };
  }
  return application;
}

describe("Mate State Transitions", () => {
  describe("Application state transitions", () => {
    it("should transition PENDING to ACCEPTED", () => {
      const app: MateApplication = {
        id: "app1",
        post_id: "post1",
        user_id: "user1",
        state: "PENDING",
        created_at: new Date().toISOString(),
      };

      const updated = transitionApplicationState(app, "accept");
      expect(updated.state).toBe("ACCEPTED");
    });

    it("should transition PENDING to REJECTED", () => {
      const app: MateApplication = {
        id: "app1",
        post_id: "post1",
        user_id: "user1",
        state: "PENDING",
        created_at: new Date().toISOString(),
      };

      const updated = transitionApplicationState(app, "reject");
      expect(updated.state).toBe("REJECTED");
    });

    it("should not accept non-PENDING applications", () => {
      const app: MateApplication = {
        id: "app1",
        post_id: "post1",
        user_id: "user1",
        state: "ACCEPTED",
        created_at: new Date().toISOString(),
      };

      expect(() => transitionApplicationState(app, "accept")).toThrow();
    });

    it("should not reject non-PENDING applications", () => {
      const app: MateApplication = {
        id: "app1",
        post_id: "post1",
        user_id: "user1",
        state: "REJECTED",
        created_at: new Date().toISOString(),
      };

      expect(() => transitionApplicationState(app, "reject")).toThrow();
    });
  });

  describe("Duplicate request blocking", () => {
    it("should detect duplicate application for same post and user", () => {
      const apps: MateApplication[] = [
        {
          id: "app1",
          post_id: "post1",
          user_id: "user1",
          state: "PENDING",
          created_at: new Date().toISOString(),
        },
      ];

      const isDuplicate = checkDuplicateApplication(apps, "post1", "user1");
      expect(isDuplicate).toBe(true);
    });

    it("should allow different user for same post", () => {
      const apps: MateApplication[] = [
        {
          id: "app1",
          post_id: "post1",
          user_id: "user1",
          state: "PENDING",
          created_at: new Date().toISOString(),
        },
      ];

      const isDuplicate = checkDuplicateApplication(apps, "post1", "user2");
      expect(isDuplicate).toBe(false);
    });

    it("should allow same user for different post", () => {
      const apps: MateApplication[] = [
        {
          id: "app1",
          post_id: "post1",
          user_id: "user1",
          state: "PENDING",
          created_at: new Date().toISOString(),
        },
      ];

      const isDuplicate = checkDuplicateApplication(apps, "post2", "user1");
      expect(isDuplicate).toBe(false);
    });
  });

  describe("Post closure affects applications", () => {
    it("should close PENDING application when post closes", () => {
      const app: MateApplication = {
        id: "app1",
        post_id: "post1",
        user_id: "user1",
        state: "PENDING",
        created_at: new Date().toISOString(),
      };

      const post: MatePost = {
        id: "post1",
        status: "CLOSED",
        end_date: new Date().toISOString(),
      };

      const updated = updateApplicationStateIfPostClosed(app, post);
      expect(updated.state).toBe("CLOSED");
    });

    it("should not change ACCEPTED application when post closes", () => {
      const app: MateApplication = {
        id: "app1",
        post_id: "post1",
        user_id: "user1",
        state: "ACCEPTED",
        created_at: new Date().toISOString(),
      };

      const post: MatePost = {
        id: "post1",
        status: "CLOSED",
        end_date: new Date().toISOString(),
      };

      const updated = updateApplicationStateIfPostClosed(app, post);
      expect(updated.state).toBe("ACCEPTED");
    });

    it("should not change application when post is still open", () => {
      const app: MateApplication = {
        id: "app1",
        post_id: "post1",
        user_id: "user1",
        state: "PENDING",
        created_at: new Date().toISOString(),
      };

      const post: MatePost = {
        id: "post1",
        status: "OPEN",
        end_date: new Date(Date.now() + 86400000).toISOString(),
      };

      const updated = updateApplicationStateIfPostClosed(app, post);
      expect(updated.state).toBe("PENDING");
    });
  });
});
