const fs = require('fs');
const files = [
  'BenefitsChallenges.jsx', 'CallToAction.jsx', 'CaseStudies.jsx', 
  'Future.jsx', 'Hero.jsx', 'Introduction.jsx', 'KeyTopics.jsx', 'ToolsPlatforms.jsx'
].map(f => 'src/components/' + f);

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (!content.includes('framer-motion')) {
      content = "import { motion } from 'framer-motion';\n" + content;
      fs.writeFileSync(f, content);
      console.log('Fixed', f);
    }
  }
});
