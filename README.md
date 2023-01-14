# Spill Your Tea 🍵

## Inspiration
Having witnessed the astounding power of ChatGPT, we are inspired to create an application with it. Initially, we just wanted to create an application that allows you to "feel" as though you are messaging another person - even if the other person is not present (or simply unwilling to talk to you). Spill Your Tea extends this idea to a patronus for mental wellness (💚), characteristic bars for emotion tracking (📊) and much more. 

## What it does

*   Talk to another person 💬.

Do you wish to talk to someone even though you know that they are unavailable? Ever wondered whether your cheesy pickup line actually works? Want to avoid an awkward rejection? Not sure if your friend already had dinner plans? Fret not, because Spill Your Tea enables your to converse with your friend's avatar. Your friend's avatar is trained on their previous text messages and those information could possibly answer your questions!

Example: If you tried a pickup line and saw "😊 -9", then you should probably sweep that pickup line under the carpet.

*   Emotion tracking 📊.

Each person is characterized by three attributes: mood (😊), energy (⚡) and kindness (❤️). After every conversation, we update each attribute via the third prompt below.

*   Mental wellness 💚.

Each person is assigned to a patronus. Your patronus's attributes will never be impacted by what you say, so feel free to divulge anything to your patronus 😇 and heed their advice (up to your own discretion).

## How we built it
We built it with a plain HTML frontend (with CSS/JS) and a Flask backend (with SQLite as DB and calls OpenAI API).

For our characters, we selected Ash and Serena from Pokémon (yea, we know the 2D sprite is actually not Serena - we had a hard time finding 2D sprites).

For OpenAI API, we engineered the following prompts. In all of these cases, ChatGPT is called upon to complete the prompts. We used ```text-davinci-003```, the most powerful ChatGPT model so far (which is also the most powerful at burning a hole in our wallets 🥲).

1.  When Person ```<A>``` is talking with their patronus ```<P>```.
```
Here is a conversation between <A> and <P>.
<A>: <previous conversation>
<P>: <previous conversation>
<A>: <previous conversation>
<P>: <previous conversation>
<A>: <current sentence>
<P>:
```

2.  When Person ```<A>``` is talking with their friend ```<B>```. Here ```<P>``` is ```<B>```'s patronus.
```
Here is a conversation between <B> and <P>.
<B>: <previous conversation>
<P>: <previous conversation>
<B>: <previous conversation>
<P>: <previous conversation>

<A> then talks to <B>.
<A>: <previous conversation>
<B>: <previous conversation>
<A>: <previous conversation>
<B>:
```

3.  When checking for Mood.
```
Here is a conversation between <A> and <P>.
<A>: <previous conversation>
<P>: <previous conversation>
<A>: <previous conversation>
<P>: <previous conversation>
<A>: <current sentence>
<P>: <autoregressively completed by ChatGPT>

After this conversation, <A>'s mood changed by (enter a number from -10 to 10):
```
(Remark: "mood" is replaced with "energy" and "kindness" as well. This prompt functions surprisingly well; ChatGPT almost always returns a number.)

## Challenges we ran into
Even with the most powerful ChatGPT model ("text-davinci-003"), ChatGPT often produces undeterministic output. Thus we have to introduce a lot of parsing algorithms and do extensive error handling.

## Accomplishments that we're proud of
Finishing the project under the available budget of $18 (initial grant for using ChatGPT API)

## What we learned
- Using CSS and Javascript to animate 2D sprites.
- Prompt engineering with ChatGPT.

## What's next for Spill-Your-Tea
- More users → more data → profit!
- Facilitate the importing of chat messages from Whatsapp/Messenger/Telegram
- Use ChatGPT to learn human characteristics and consciousness
- Security measures (censoring confidential information e.g. location, passwords, ...)
- Actually, just wait for a more powerful ChatGPT model to come out 🤷