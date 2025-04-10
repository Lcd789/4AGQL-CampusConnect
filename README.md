
```
4AGQL-CampusConnect
├─ api-gateway
│  ├─ .meshrc.yml
│  ├─ Dockerfile
│  ├─ package-lock.json
│  └─ package.json
├─ CampusConnect
│  ├─ .dockerignore
│  ├─ Dockerfile
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ nginx.conf
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ vite.svg
│  ├─ src
│  │  ├─ api
│  │  │  ├─ auth
│  │  │  │  ├─ authMutations.ts
│  │  │  │  └─ authQueries.ts
│  │  │  ├─ classes
│  │  │  │  ├─ classMutations.ts
│  │  │  │  └─ classQueries.ts
│  │  │  ├─ grades
│  │  │  │  ├─ gradeMutations.ts
│  │  │  │  └─ gradeQueries.ts
│  │  │  ├─ graphqlConfig.ts
│  │  │  ├─ types.ts
│  │  │  └─ users
│  │  │     ├─ userMutations.ts
│  │  │     └─ userQueries.ts
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ structure
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ Header.tsx
│  │  │  │  └─ NotFound.tsx
│  │  │  └─ UI
│  │  │     ├─ ChartCard.tsx
│  │  │     ├─ DataTable.tsx
│  │  │     └─ StatCard.tsx
│  │  ├─ context
│  │  │  ├─ AuthContext.tsx
│  │  │  └─ ThemeContext.tsx
│  │  ├─ hooks
│  │  │  └─ usePermissions.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ auth
│  │  │  │  ├─ Login.tsx
│  │  │  │  └─ Register.tsx
│  │  │  ├─ common
│  │  │  │  ├─ ClassPage.tsx
│  │  │  │  ├─ Home.tsx
│  │  │  │  └─ Profile.tsx
│  │  │  ├─ eduadmin
│  │  │  │  └─ Dashboard.tsx
│  │  │  ├─ professor
│  │  │  │  ├─ ClassManagement.tsx
│  │  │  │  ├─ ClassManagementDetail.tsx
│  │  │  │  ├─ GradeManagement.tsx
│  │  │  │  └─ ProfessorDashBoard.tsx
│  │  │  └─ student
│  │  │     ├─ StudentClasses.tsx
│  │  │     ├─ StudentDashBoard.tsx
│  │  │     └─ StudentGrades.tsx
│  │  ├─ utils
│  │  │  ├─ avatarUtils.ts
│  │  │  └─ jwt.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ docker-compose.yml
├─ micro-services
│  ├─ class-service
│  │  ├─ config
│  │  │  └─ db.js
│  │  ├─ Dockerfile
│  │  ├─ graphql
│  │  │  ├─ mutations.js
│  │  │  ├─ queries.js
│  │  │  ├─ schema.js
│  │  │  └─ types.js
│  │  ├─ index.js
│  │  ├─ middleware
│  │  │  └─ auth.js
│  │  ├─ models
│  │  │  ├─ Class.js
│  │  │  ├─ Enrollment.js
│  │  │  └─ User.js
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  └─ tests
│  │     └─ class.test.js
│  ├─ grade-service
│  │  ├─ config
│  │  │  └─ db.js
│  │  ├─ Dockerfile
│  │  ├─ graphql
│  │  │  ├─ mutations.js
│  │  │  ├─ queries.js
│  │  │  ├─ schema.js
│  │  │  └─ types.js
│  │  ├─ index.js
│  │  ├─ middleware
│  │  │  └─ auth.js
│  │  ├─ models
│  │  │  ├─ Course.js
│  │  │  ├─ Grade.js
│  │  │  └─ User.js
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  └─ tests
│  │     └─ grade.test.js
│  └─ user-service
│     ├─ config
│     │  └─ db.js
│     ├─ Dockerfile
│     ├─ graphql
│     │  ├─ mutations.js
│     │  ├─ queries.js
│     │  ├─ schema.js
│     │  └─ types.js
│     ├─ index.js
│     ├─ middleware
│     │  └─ auth.js
│     ├─ models
│     │  └─ User.js
│     ├─ package-lock.json
│     ├─ package.json
│     └─ tests
│        └─ user.test.js
├─ nginx-lb
│  ├─ Dockerfile
│  └─ nginx.conf
├─ package-lock.json
└─ README.md

```