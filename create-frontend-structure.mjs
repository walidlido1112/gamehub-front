import fs from 'fs';
import path from 'path';

// قائمة المجلدات والملفات التي سيتم إنشاؤها
const structure = {
  'public': ['index.html'],
  'src': {
    'components': {
      'Auth': ['Register.jsx', 'Login.jsx'],
      'Dashboard': ['EmployeeDashboard.jsx', 'AdminDashboard.jsx'],
      'Forms': ['AccountForm.jsx', 'OrderForm.jsx'],
      'Shared': ['Navbar.jsx', 'Sidebar.jsx']
    },
    'pages': ['HomePage.jsx', 'ErrorPage.jsx'],
    'App.jsx': '',
    'index.jsx': '',
    'index.css': ''
  },
  'tailwind.config.js': '',
  'postcss.config.js': '',
  'package.json': JSON.stringify({
    name: 'frontend',
    version: '1.0.0',
    description: 'Frontend for MERN CRUD Project',
    main: 'index.jsx',
    scripts: {
      start: 'vite',
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'react-router-dom': '^6.8.0',
      tailwindcss: '^3.0.0',
      postcss: '^8.4.0',
      autoprefixer: '^10.4.0'
    },
    devDependencies: {
      vite: '^4.0.0'
    }
  }, null, 2),
  'README.md': '# Frontend\n\nThis is the frontend for the MERN CRUD Project.'
};

// دالة لإنشاء المجلدات والملفات
const createStructure = (basePath, structure) => {
  Object.entries(structure).forEach(([key, value]) => {
    const fullPath = path.join(basePath, key);
    if (typeof value === 'string') {
      // إنشاء ملف
      fs.writeFileSync(fullPath, value);
    } else {
      // إنشاء مجلد
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      // إنشاء الهيكل الفرعي
      createStructure(fullPath, value);
    }
  });
};

// تنفيذ السكربت
const currentDirectory = path.resolve();
createStructure(currentDirectory, structure);

console.log('Project structure created successfully!');
