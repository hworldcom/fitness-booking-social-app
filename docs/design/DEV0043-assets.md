# DEV0043 visual assets

The [MVP visual direction](../mvp-spec.md#visual-design-direction--21-september-2026) remains the product contract. [DEV0043](../../tickets/archive/frontend/DEV0043-playful-club-ui-redesign.md) records implementation and validation.

- [Preferred concept](DEV0043-preferred-concept.png): first generated homepage mockup accepted by the user. This is a design reference, never rendered as the application UI. Features pictured in it do not override the specification.
- Existing [running-club image](../../public/images/run-club.webp): generated 19 September 2026 for the original preview; reused without changing the original file. CSS crops it responsively.
- [Strength studio](../../public/images/strength-studio.webp) and [Muay Thai studio](../../public/images/muay-thai-studio.webp): generated 21 September 2026 using the built-in image-generation tool. Fictional illustrative interiors, not photographs of the named example businesses. Exported as 1000-pixel-wide WebP at quality 82 using Sharp for local delivery. Original generated PNGs remain in the generation output directory.
- Small hero spark: inline decorative SVG; underline and sticker treatment use CSS. No rasterized text or interactive controls.
- Display headings: `@fontsource-variable/bricolage-grotesque` pinned at 5.3.0, locally served. Body text retains Manrope. Font licenses are distributed with their installed packages.

## Final generation prompts

### Strength studio

Create a photorealistic editorial photograph for a fictional Berlin neighborhood fitness studio card in the RepX Club app. Landscape 3:2 composition, photograph only, no UI, no text, no branding or signs. Beautiful warmly lit renovated brick industrial ground-floor strength training studio, large windows with soft morning light, tidy free weights, kettlebells, a wooden bench, rubber floor, a few leafy plants, inviting and approachable for all levels. Focus on architecture and studio atmosphere, no people. Cream, charcoal and natural warm tones, honest candid architectural photography, restrained contrast, not luxury spa, not grungy or dramatic. Subject visible and recognizable when cropped as a small landscape thumbnail. This is an illustrative fictional venue, not a photograph of a real named gym.

### Muay Thai studio

Photorealistic editorial architectural photo only for an illustrative fictional neighborhood Muay Thai studio in Berlin. Landscape 3:2 frame. Welcoming airy renovated warehouse with tall windows, warm cream walls and some brick, two charcoal heavy punching bags on the right, tidy dark training mats, small wooden bench and a large green plant near the left window. Natural soft daytime light, warm neutral colours, lived-in but clean, professional accessible local gym rather than luxurious resort. No people, no words, no logos or signs, no watermarks, no UI. Compose for a small website studio thumbnail; clear recognizable bags and inviting daylight, restrained contrast. Not a photograph of any real named business.
