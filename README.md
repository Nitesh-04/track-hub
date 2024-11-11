# TrackHub
### Description
TrackHub is a platform for managing internship applications. It tracks application statuses, deadlines, and relevant dates, helping users stay organized. With features like reminders and adding applications, TrackHub offers a streamlined dashboard for easy access to important information.

### Features

- Track Applications: Keep all your internship applications organized and easily accessible in one place, making it simple to monitor your progress.

- Add Rounds: Add and manage interview rounds, tests, and other application steps specific to each internship, customizing the process to your needs.

- Stay Updated: Track the progress of each application by updating its status, from submitted to coding to interview to offer, all in one intuitive dashboard.

- Set Reminders: (Coming Soon) Stay ahead by setting reminders for important deadlines, upcoming interviews, or coding challenges, ensuring you never miss an opportunity.


### Inorder to test the application locally:
1. Clone the repository: `git clone https://github.com/Nitesh-04/track-hub.git`
2. Install dependencies: `npm install`
3. Set Environment Variables:
     ```
     DATABASE_URL=
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
     CLERK_SECRET_KEY=
     NEXT_PUBLIC_CLERK_SIGN_IN_URL=
     NEXT_PUBLIC_CLERK_SIGN_UP_URL=
     NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
     NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=
     ```
4. Migrate Prisma Scehmas: `npx prisma migrate dev --name migration_name` and then `npx prisma generate`  
5. Run the local server: `npm run dev`

### Tech Stack Used
- Next.js
- Typescript
- Clerk Auth
- ShadCN UI
- Prisma
- Cron Jobs

### Have any queries?
Feel free to contact me on LinkedIn ! You can find the my socials at my GitHub Profile.
