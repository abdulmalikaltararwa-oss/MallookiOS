# MallookiOS — How to Edit the App

All edits happen in one file: **`src/index.html`**
Open it on GitHub by clicking the file, then click the ✏️ pencil icon to edit.
When you're done, scroll down and click **"Commit changes"**.
GitHub will automatically build a new `.exe` within ~5 minutes.

---

## Where to download the built EXE

1. Go to your repository on GitHub
2. Click **Actions** tab at the top
3. Click the latest green checkmark build
4. Scroll down to **Artifacts**
5. Download **MallookiOS-Windows**
6. Unzip it — run the `.exe` inside

---

## COMMON EDITS — search for these in index.html

Use Ctrl+F on GitHub to find these exact words.

---

### Change the app title / subtitle
Search for: `Life OS`
```
<h1 id="appTitle" ...>Life OS</h1>
<div class="sub" id="appSub" ...>Kuwait · Fall 2026</div>
```
Change the text between the tags.

---

### Change colors
Search for: `TOKENS`
You'll find this block at the top:
```css
:root {
  --ink:    #1a0a0f;   /* main background */
  --rose:   #8b3252;   /* dark accent */
  --blush:  #c0607a;   /* main pink */
  --petal:  #e8a0b0;   /* light pink */
  --gold:   #c9956a;   /* streak/highlight gold */
}
```
Replace any hex color code with a new one.
Use coolors.co to pick colors.

---

### Change default habits
Search for: `DEFAULT_STATE`
Find the `habits:` array:
```javascript
habits: [
  {id:1, name:'Fajr',    days:{}},
  {id:2, name:'Dhuhr',   days:{}},
  ...
]
```
- Edit `name:` to rename a habit
- Copy/paste a line to add a habit (give it a unique `id` number)
- Delete a line to remove a habit

**Note:** habit ids 1-5 are used for the Prayer streak counter.
Habit id 6 = Cardio, 7 = Gym, 8 = Read. Don't change these ids.

---

### Change the workout rotation (Mon–Sun)
Search for: `workout:`
```javascript
workout: [
  {type:'Upper',    rest:false},  // Monday
  {type:'Lower',    rest:false},  // Tuesday
  {type:'Full Body',rest:false},  // Wednesday
  {type:'Rest',     rest:true },  // Thursday
  {type:'Upper',    rest:false},  // Friday
  {type:'Lower',    rest:false},  // Saturday
  {type:'Full Body',rest:false},  // Sunday
],
```
Change `type:` to whatever you want (Push/Pull/Legs, etc.)
For rest days, keep `rest:true`. For workout days use `rest:false`.

---

### Change exercises
Search for: `workoutCards:`
Each card looks like:
```javascript
{id:1, title:'Upper Body', subtitle:'Push & Pull', exercises:[
  {id:101, name:'Bench Press',    sets:'4×8'},
  {id:102, name:'Barbell Row',    sets:'4×8'},
  ...
]}
```
- Edit `name:` for exercise name
- Edit `sets:` for sets/reps (e.g. `'5×5'`, `'3×12'`, `'4×8 @ 80kg'`)
- Copy/paste a line to add an exercise (give it a unique `id`)
- Delete a line to remove an exercise
- Edit `title:` and `subtitle:` for the card heading

---

### Change the daily quote
Search for: `quote:`
```javascript
quote: {
  text:   'The mind is not a vessel to be filled, but a fire to be kindled.',
  author: '— Plutarch'
},
```
Replace with any quote you like. The quote is also editable live in the app itself.

---

### Change default goals
Search for: `goals:`
```javascript
goals: [
  {id:1, text:'Your goal here', category:'Academic', deadline:'2026-05-01', progress:60, notes:''},
  ...
]
```
- `category` must be one of: `Academic`, `Career`, `Health`, `Personal`, `Creative`
- `progress` is 0–100
- `deadline` is YYYY-MM-DD format

---

### Change default books
Search for: `books:`
Each book:
```javascript
{id:1, title:'1984', author:'George Orwell', status:'unread', rating:null, notes:'', coverUrl:''},
```
- `status` is `unread`, `reading`, or `done`
- `rating` is null or a number 1–5

---

### Add or remove goal categories
Search for: `ALL_CATS`
```javascript
const ALL_CATS = ['Academic','Career','Health','Personal','Creative'];
```
Add or remove category names here.
Then find the Goal modal dropdown and add/remove the matching `<option>` tag:
```html
<select id="gCat">
  <option>Academic</option>
  <option>Career</option>
  ...
</select>
```

---

### Change fonts
Search for: `fonts.googleapis`
Replace the font names in the Google Fonts URL and in the CSS.
Good pairing sites: fontpair.co

---

## FILE STRUCTURE

```
MallookiOS/
├── .github/
│   └── workflows/
│       └── build.yml     ← GitHub Action (don't touch this)
├── src/
│   ├── main.js           ← Electron window setup (rarely need to edit)
│   ├── preload.js        ← Bridge file (don't touch)
│   └── index.html        ← EVERYTHING ELSE — edit this file
└── package.json          ← App name and build config
```

---

## UPDATING THE APP

1. Edit `src/index.html` on GitHub (pencil icon)
2. Commit the change
3. Go to Actions tab → wait ~5 min for the green checkmark
4. Download the new `.exe` from Artifacts
5. Run it — your data is safe in Supabase, the new version loads it automatically
