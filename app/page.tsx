import Header from "@/app/components/header";
import ChatSection from "./components/chat-section";

export default function Home() {
  return (
    <main className="h-screen w-screen flex flex-col bg-white">
      <div className="w-[90%] lg:w-[60rem] mx-auto pt-4">
        <Header />
        <div className="mt-4">
          <ChatSection />
        </div>
      </div>
    </main>
  );
}
