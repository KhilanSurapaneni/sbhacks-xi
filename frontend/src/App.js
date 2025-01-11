function ProfileButton() {
  return (
    <button>
      Profile
    </button>
  );
}

function JournalButton() {
  return (
    <button>
      Journal
    </button>
  )
}

export default function MyApp() {
  return (
    <div>
      <h1 class="welcome">Welcome to Mindful Moments</h1>
      <ProfileButton />
      <JournalButton />
    </div>
  );
}
