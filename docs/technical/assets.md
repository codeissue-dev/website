# Visual assets

## Brand assets

The codeissue mark, favicon, app icon, and Apple touch icon are maintained locally under `public/images` and `app`. The brand mark is used for product identity. Editorial photography must not be replaced with stretched avatars or social profile images.

## Editorial photography

The website includes locally optimized WebP derivatives of photographs downloaded from Pexels. They are used as contextual product imagery and do not load from an external CDN at runtime.

| Local file                                     | Source page                                                                                                         | Use                                            |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `public/images/editorial/material-review.webp` | `https://www.pexels.com/photo/leather-samples-on-the-table-for-selection-6648439/`                                  | material, review, and design-system scenes     |
| `public/images/editorial/workflow-wall.webp`   | `https://www.pexels.com/photo/man-standing-in-front-of-a-wall-with-sticky-notes-in-an-office-and-thinking-6804078/` | discovery, authentication, and planning scenes |
| `public/images/editorial/workflow-board.webp`  | `https://www.pexels.com/photo/sticky-notes-on-the-task-board-wall-6804093/`                                         | workflow, hero, and product planning scenes    |

The source pages identify the photographer as cottonbro studio and provide the assets under the Pexels license. Preserve this file when changing or redistributing the image set.

## Image rules

- Store production assets locally.
- Prefer WebP or AVIF for large photographs.
- Keep the longest edge near the largest rendered size rather than shipping original camera resolution.
- Use `next/image` with meaningful responsive `sizes`.
- Decorative images use an empty `alt`; informative images require localized alternative text.
- Do not use external image URLs in rendered components unless the domain and lifecycle are explicitly controlled.
