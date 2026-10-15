import type { Banner } from '../banner';
import type { BannerFormat } from '../formats';

/** Every template layout takes the resolved banner and the format's size. */
export interface TemplateProps {
  banner: Banner;
  format: BannerFormat;
}
