/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import About from './pages/About';
import CRM from './pages/CRM';
import CapTable from './pages/CapTable';
import Conferences from './pages/Conferences';
import Funding from './pages/Funding';
import Home from './pages/Home';
import Partnerships from './pages/Partnerships';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import Roadmap from './pages/Roadmap';
import TaskManager from './pages/TaskManager';
import TheInnovations from './pages/TheInnovations';
import UserManagement from './pages/UserManagement';
import Technology from './pages/Technology';
import BusinessModel from './pages/BusinessModel';
import Innovators from './pages/Innovators';
import __Layout from './Layout.jsx';


export const PAGES = {
    "About": About,
    "CRM": CRM,
    "CapTable": CapTable,
    "Conferences": Conferences,
    "Funding": Funding,
    "Home": Home,
    "Partnerships": Partnerships,
    "Profile": Profile,
    "Projects": Projects,
    "Roadmap": Roadmap,
    "TaskManager": TaskManager,
    "TheInnovations": TheInnovations,
    "UserManagement": UserManagement,
    "Technology": Technology,
    "BusinessModel": BusinessModel,
    "Innovators": Innovators,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};