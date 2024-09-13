import Logo from "./Logo.png";
import Bell from "./bell.png";
import Profile from "./Profile.png";
import Mail from "./mail.png";

export default function Header() {
  return (
    <div className="flex h-[100px] items-center justify-between bg-[#222E50] p-5">
      <div className="flex items-center gap-2">
        <img src={Logo} alt="Logo" className="flex h-[47px] w-[42px]" />
        <div className="text-white">MoneyTrack</div>
      </div>
      <div className="flex gap-3">
        <img src={Mail} alt="Logo" className="h-6 w-6" />
        <img src={Bell} alt="Logo" className="h-6 w-6" />
        <img src={Profile} alt="Logo" className="h-6 w-6" />
      </div>
    </div>
  );
}
