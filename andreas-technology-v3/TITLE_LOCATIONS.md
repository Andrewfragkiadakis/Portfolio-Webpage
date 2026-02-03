# Title Locations Guide

## Where to Edit Typewriter Titles

The titles **"APPLIED COMPUTER SCIENCE SPECIALIST"** and **"NETWORK & SYSTEMS ENGINEER"** appear in the hero section's typewriter animation.

### File Location
`src/data/content.ts`

### English Version (lines 136-144)
```typescript
hero: {
    firstName: "ANDREAS",
    lastName: "FRAGKIADAKIS",
    typewriter: [
        "SYSTEM ENGINEER // IT & SECURITY ENGINEER",
        "NETWORK & SYSTEMS ENGINEER",  // ← Line 138
        "CONVERSATIONAL AI ENGINEER",
        "INFRASTRUCTURE & SUPPORT ENGINEER",
        "CLOUD & DEVOPS ENTHUSIAST",
        "APPLIED COMPUTER SCIENCE SPECIALIST",  // ← Line 142
        "CREATIVE PROBLEM SOLVER"
    ],
    // ...
}
```

### Greek Version (lines 408-416)
```typescript
hero: {
    firstName: "ΑΝΔΡΕΑΣ",
    lastName: "ΦΡΑΓΚΙΑΔΑΚΗΣ",
    typewriter: [
        "SYSTEM ENGINEER // IT & SECURITY ENGINEER",
        "NETWORK & SYSTEMS ENGINEER",  // ← Line 410
        "CONVERSATIONAL AI ENGINEER",
        "INFRASTRUCTURE & SUPPORT ENGINEER",
        "CLOUD & DEVOPS ENTHUSIAST",
        "APPLIED COMPUTER SCIENCE SPECIALIST",  // ← Line 414
        "CREATIVE PROBLEM SOLVER"
    ],
    // ...
}
```

### How to Edit
1. Open `src/data/content.ts`
2. Navigate to the `content` object
3. Find the `hero.typewriter` array (both `en` and `gr` versions)
4. Edit the strings in the array to change what appears in the typewriter animation
5. The typewriter cycles through all items in the array

### Display Location
These titles appear in the hero section (`HeroOverlay.tsx`) and are rendered using the `typewriter-effect` library.
