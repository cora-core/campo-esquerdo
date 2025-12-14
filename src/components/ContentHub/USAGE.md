// ContentHub Component - Usage Guide
// ====================================

/**
 * OVERVIEW:
 * ContentHub is a flexible, mode-switching component that combines multiple views
 * into a single reusable interface. It's designed for desktop layouts and can be 
 * easily placed anywhere in your page flow.
 * 
 * FEATURES:
 * - 4 modes: calendar, galeria, conspiradorys, +links
 * - Clean desktop-style UI with sidebar mode selectors
 * - Mode switching via header buttons and sidebar buttons
 * - Built-in state management for mode selection
 * - Fully typed with TypeScript
 * 
 * STRUCTURE:
 * src/components/
 *   ├── ContentHub/
 *   │   ├── ModePanel.tsx (Main component - renamed from ModePanel)
 *   │   ├── ContentHubHeader.tsx (Header with mode selector buttons)
 *   │   ├── CalendarView.tsx (Calendar mode view)
 *   │   ├── GaleriaView.tsx (Gallery mode view)
 *   │   ├── ConspiradorysView.tsx (Conspiradorys mode view)
 *   │   ├── LinksView.tsx (+Links mode view)
 *   │   └── index.ts (Exports)
 *   └── ContentHubWrapper.tsx (Optional wrapper with responsive sizing)
 * 
 * ============================================================
 * BASIC USAGE:
 * ============================================================
 * 
 * import { ContentHub } from '@/components/ContentHub';
 * 
 * // Simple usage with default calendar mode
 * <ContentHub />
 * 
 * // Start with a specific mode
 * <ContentHub defaultMode="galeria" />
 * <ContentHub defaultMode="conspiradorys" />
 * <ContentHub defaultMode="+links" />
 * 
 * ============================================================
 * USING THE WRAPPER:
 * ============================================================
 * 
 * import ContentHubWrapper from '@/components/ContentHubWrapper';
 * 
 * // Full screen on mobile, 600px on desktop
 * <ContentHubWrapper defaultMode="calendar" />
 * 
 * ============================================================
 * HOW IT WORKS:
 * ============================================================
 * 
 * LAYOUT:
 * 
 *   ┌──────────────────────────────────────────────────┐
 *   │  [icon]      CONSPIRADORYS │ +LINKS │ CALENDÁRIO  │
 *   ├────┬─────────────────────────────────────────┬────┤
 *   │    │    [icon]                              │    │
 *   │    ├─────────────────────────────────────────┤    │
 *   │ G  │                                         │ + L │
 *   │ A  │    Mode-specific content goes here     │ I I │
 *   │ L  │    (calendar, gallery, links, etc)    │ N N │
 *   │ E  │                                         │ K K │
 *   │ R  │                                         │ S S │
 *   │ I  ├─────────────────────────────────────────┤    │
 *   │ A  │   [CALENDÁRIO button]                   │    │
 *   └────┴─────────────────────────────────────────┴────┘
 * 
 * MODE SELECTION:
 * - Click buttons in header to switch modes
 * - Click sidebar buttons to switch modes
 * - Current mode is highlighted in gray
 * 
 * ============================================================
 * AVAILABLE MODES:
 * ============================================================
 * 
 * 1. 'calendar' - Calendar view (default)
 *    Currently placeholder, ready for calendar implementation
 * 
 * 2. 'galeria' - Gallery/image view
 *    Currently placeholder, ready for gallery implementation
 * 
 * 3. 'conspiradorys' - Conspiracy theories view
 *    Currently placeholder, ready for content implementation
 * 
 * 4. '+links' - Links view
 *    Currently placeholder, ready for links implementation
 * 
 * ============================================================
 * CUSTOMIZATION:
 * ============================================================
 * 
 * To add content to any view:
 * 1. Open the corresponding view file (e.g., CalendarView.tsx)
 * 2. Replace the placeholder content
 * 3. The mode switching will automatically display your content
 * 
 * To customize styling:
 * - Edit the Tailwind classes in ModePanel.tsx
 * - Update ContentHubHeader.tsx for header styling
 * - Modify individual view components as needed
 * 
 * To change default mode:
 * <ContentHub defaultMode="conspiradorys" />
 * 
 * ============================================================
 * TYPE DEFINITIONS:
 * ============================================================
 * 
 * type Mode = 'conspiradorys' | '+links' | 'calendar' | 'galeria';
 * 
 * interface ContentHubProps {
 *   defaultMode?: Mode; // Default is 'calendar'
 * }
 * 
 * ============================================================
 * COMPONENT TREE:
 * ============================================================
 * 
 * ContentHub (main container)
 *   ├── ContentHubHeader (top bar with mode buttons)
 *   └── Main Layout (flex row)
 *       ├── Left Sidebar (GALERIA button)
 *       ├── Center Content (flex column)
 *       │   ├── Top Icon Area
 *       │   ├── Content Area (current view renders here)
 *       │   └── Bottom CALENDÁRIO Button
 *       └── Right Sidebar (+LINKS button)
 * 
 * ============================================================
 * INTEGRATION EXAMPLE:
 * ============================================================
 * 
 * // In your page.tsx or any component:
 * 
 * import { ContentHub } from '@/components/ContentHub';
 * 
 * export default function YourPage() {
 *   return (
 *     <main>
 *       <h1>Welcome</h1>
 *       
 *       {/* Add ContentHub anywhere in your layout */}
 *       <section className="my-8">
 *         <ContentHub defaultMode="calendar" />
 *       </section>
 *     </main>
 *   );
 * }
 * 
 * ============================================================
 * EXPORTING TO ANOTHER PROJECT:
 * ============================================================
 * 
 * To use ContentHub in another project, copy the entire 
 * `src/components/ContentHub/` folder containing:
 * 
 * | File                    | Purpose                                    |
 * |-------------------------|--------------------------------------------|
 * | index.ts                | Main export                                |
 * | ModePanel.tsx           | Core component with mode switching, drag   |
 * | CalendarView.tsx        | Calendar mode wrapper                      |
 * | SimpleCalendar.tsx      | Calendar component                         |
 * | GaleriaView.tsx         | Galeria mode                               |
 * | LinksView.tsx           | Links mode                                 |
 * | ConspiradorysView.tsx   | Conspiradorys mode                         |
 * 
 * REQUIREMENTS IN TARGET PROJECT:
 * 
 * 1. React 18+ with TypeScript
 * 2. Tailwind CSS configured
 * 3. Custom font `font-ui-gothic` in your Tailwind config 
 *    (or remove/replace it in ModePanel.tsx)
 * 4. Asset: `/expand.svg` in the public folder for the expand button icon
 * 
 * USAGE IN NEW PROJECT:
 * 
 * import { ContentHub } from '@/components/ContentHub';
 * 
 * // Basic usage
 * <ContentHub />
 * 
 * // With default mode
 * <ContentHub defaultMode="galeria" />
 * 
 * NOTE: If you don't need all 4 modes, you can remove unused view files 
 * and their imports from ModePanel.tsx.
 * 
 * ============================================================
 */

export {};
