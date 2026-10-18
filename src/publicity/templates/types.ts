import type { ResolvedEdition, ResolvedSession } from '../edition';
import type { Format } from '../formats';

/** A lectures template's per-session layout also gets the session it is for. */
export interface SessionProps extends TemplateProps {
  session: ResolvedSession;
}

/** Every template layout takes the resolved edition and the format's size. */
export interface TemplateProps {
  edition: ResolvedEdition;
  format: Format;
}
