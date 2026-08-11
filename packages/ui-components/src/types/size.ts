/**
 * Shared size scale used by most components (`Button`, `Input`, `Select`, ...).
 * Components with a wider scale (e.g. `Avatar`, `Spinner`) use `BipSizeExtended`;
 * components with a narrower/different scale (e.g. `Text`, `Heading`) keep their
 * own local type rather than force-fitting this one.
 */
export type BipSize = 'sm' | 'md' | 'lg';

/** `BipSize` plus the `xs`/`xl` extremes used by a handful of components (Avatar, Spinner, Modal). */
export type BipSizeExtended = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
