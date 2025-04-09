# 4AGQL-CampusConnect
 Une application web pour améliorer l'expérience des étudiants et des professeurs, permettant d'accéder aux informations importantes de la vie étudiante/scolaire (notes, cours, classes, etc.). L'API est GraphQL et utilise des microservices.

```
4AGQL-CampusConnect
├─ api-gateway
│  ├─ .meshrc.yaml
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
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ structure
│  │  │  │  ├─ Footer.tsx
│  │  │  │  └─ Header.tsx
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
│  │  │  │  ├─ GradeManagement.tsx
│  │  │  │  └─ ProfessorDashBoard.tsx
│  │  │  └─ student
│  │  │     ├─ Classes.tsx
│  │  │     ├─ Grades.tsx
│  │  │     ├─ StudentClasses.tsx
│  │  │     ├─ StudentDashBoard.tsx
│  │  │     └─ StudentGrades.tsx
│  │  ├─ utils
│  │  │  └─ jwt.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
├─ docker-compose.yml
├─ micro-services
│  ├─ auth-service
│  │  ├─ config
│  │  │  └─ db.js
│  │  ├─ Dockerfile
│  │  ├─ graphql
│  │  │  ├─ mutation.js
│  │  │  ├─ queries.js
│  │  │  ├─ schema.js
│  │  │  └─ types.js
│  │  ├─ index.js
│  │  ├─ middleware
│  │  │  └─ auth.js
│  │  ├─ models
│  │  │  └─ User.js
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  └─ tests
│  │     └─ user.test.js
│  ├─ class-service
│  │  ├─ config
│  │  │  └─ db.js
│  │  ├─ Dockerfile
│  │  ├─ graphql
│  │  │  ├─ mutation.js
│  │  │  ├─ queries.js
│  │  │  ├─ schema.js
│  │  │  └─ types.js
│  │  ├─ index.js
│  │  ├─ middleware
│  │  │  └─ auth.js
│  │  ├─ models
│  │  │  ├─ Class.js
│  │  │  └─ Enrollment.js
│  │  ├─ package-lock.json
│  │  ├─ package.json
│  │  └─ tests
│  │     └─ class.test.js
│  └─ grade-service
│     ├─ config
│     │  └─ db.js
│     ├─ Dockerfile
│     ├─ graphql
│     │  ├─ mutation.js
│     │  ├─ queries.js
│     │  ├─ schema.js
│     │  └─ types.js
│     ├─ index.js
│     ├─ middleware
│     │  └─ auth.js
│     ├─ models
│     │  ├─ Course.js
│     │  └─ Grade.js
│     ├─ package-lock.json
│     ├─ package.json
│     └─ tests
│        └─ grade.test.js
├─ nginx-lb
│  ├─ Dockerfile
│  └─ nginx.conf
├─ package-lock.json
└─ README.md

```