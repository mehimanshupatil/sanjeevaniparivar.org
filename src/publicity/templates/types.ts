import type { ResolvedEdition } from '../edition';
import type { Format } from '../formats';

/** Every template layout takes the resolved edition and the format's size. */
export interface TemplateProps {
  edition: ResolvedEdition;
  format: Format;
}
