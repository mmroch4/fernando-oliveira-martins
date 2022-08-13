import { Archive } from "../graphql/schema";
import { months } from "../utils/months";

class GetURL {
  public post(slug: string, archive: Archive): string {
    const [month, year] = archive.name.split(" ") as string[];

    const url = `/${year}/${months.indexOf(month.toLowerCase()) + 1}/${slug}`;

    return url;
  }

  public category(name: string): string {
    return `/tag/${name.toLowerCase()}`;
  }
}

export default new GetURL();
