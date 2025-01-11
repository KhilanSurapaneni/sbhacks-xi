import { ProfileButton } from './components/ProfileButton.jsx'
import { HomeButton } from './components/HomeButton.jsx';
import { JournalButton } from './components/JournalButton.jsx';

export default function MyApp() {
  return (
    <div>
      <div class="header">
        <h1 class="welcome">Welcome to Mindful Moments</h1>
        <div class="buttonsection">
          <div class="button"><HomeButton /></div>
          <div class="button"><ProfileButton /></div>
          <div class="button"><JournalButton /></div>
        </div>
      </div>
      <hr class="line"></hr>
      <img src="https://scholarlykitchen.sspnet.org/wp-content/uploads/2023/09/iStock-1479494606.jpg"
      alt="wellness for brain"></img>
      <p>At Mindful Moments, our mission is simple yet profound: 
        to help people prioritize their mental health and wellness 
        in a fast-paced world. We understand that life can be overwhelming, 
        and it’s easy to neglect the well-being of our minds. Through mindfulness, self-care practices, 
        and mental health education, we strive to create spaces where individuals 
        can pause, reflect, and reconnect with themselves.</p>
    </div>
  );
}
