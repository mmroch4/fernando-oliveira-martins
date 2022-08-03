import {
  GetPostsToRecommendDocument,
  GetPostsToRecommendQuery,
} from "../graphql/schema";
import { apolloClient } from "../lib/apollo";

interface IConfig {
  readonly number: number;
  readonly post: {
    id: string;
    archive: {
      id: string;
    };
    categories: {
      id: string;
    }[];
  };
  readonly order: ("categories" | "archive")[];
}

type IPost = GetPostsToRecommendQuery["posts"][0];

export class RecommendPosts {
  constructor(private config: IConfig) {}

  public async recommend(): Promise<IPost[]> {
    const {
      data: { posts: allQueriedPosts },
    } = await apolloClient.query<GetPostsToRecommendQuery>({
      query: GetPostsToRecommendDocument,
    });

    const allPosts = allQueriedPosts.filter(
      (post) => post.id !== this.config.post.id
    );

    if (allPosts.length <= this.config.number) return allPosts;

    return this.filter(allPosts, this.config.order);
  }

  private filter(posts: IPost[], order: ("categories" | "archive")[]): IPost[] {
    const methods = {
      categories: (post: IPost) => {
        return this.hasCategory(post.categories);
      },
      archive: (post: IPost) => {
        return post.archive?.id === this.config.post.archive?.id;
      },
    };

    const dump = [...posts];
    const filtered: IPost[] = [];

    const backup: IPost[] = [];
    let remaining: number = this.config.number;

    for (const filterBy of order) {
      const filtering =
        backup.length > 0
          ? backup.filter(methods[filterBy])
          : dump.filter(methods[filterBy]);

      if (filtering.length < remaining) {
        filtering.forEach((item) => {
          filtered.push(item);

          dump.splice(dump.indexOf(item), 1);

          remaining -= 1;
        });

        continue;
      } else if (filtering.length > remaining) {
        backup.splice(0, backup.length);

        filtering.forEach((item) => {
          backup.push(item);
        });

        continue;
      } else {
        filtering.slice(0, remaining).forEach((item) => {
          filtered.push(item);

          dump.splice(dump.indexOf(item), 1);

          remaining -= 1;
        });

        break;
      }
    }

    if (remaining !== 0) {
      if (backup.length > 0 && backup.length >= remaining) {
        backup.slice(0, remaining).forEach((item) => {
          filtered.push(item);

          dump.splice(dump.indexOf(item), 1);

          remaining -= 1;
        });
      } else if (backup.length > 0 && backup.length < remaining) {
        backup.forEach((item) => {
          filtered.push(item);

          dump.splice(dump.indexOf(item), 1);

          remaining -= 1;
        });
      }

      if (remaining !== 0) {
        if (dump.length > 0 && dump.length >= remaining) {
          dump.slice(0, remaining).forEach((item) => {
            filtered.push(item);

            dump.splice(dump.indexOf(item), 1);

            remaining -= 1;
          });
        } else if (dump.length > 0 && dump.length < remaining) {
          dump.forEach((item) => {
            filtered.push(item);

            dump.splice(dump.indexOf(item), 1);

            remaining -= 1;
          });
        }
      }
    }

    return filtered;
  }

  private hasCategory(categories: { id: string }[]): boolean {
    let has: boolean = false;

    for (const category of categories) {
      for (const postConfigCategories of this.config.post.categories) {
        if (category.id === postConfigCategories.id) {
          has = true;

          break;
        }
      }
    }

    return has;
  }
}
