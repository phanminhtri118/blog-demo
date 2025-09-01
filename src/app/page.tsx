import { LeftColumn as LeftSidebar } from "@/shared/components/layout/left-column";
import { RightSidebar } from "@/shared/components/layout/right-sidebar";
import { PostFeedContainer } from "@/features/posts/components/post-feed-container";

const Home = () => {
  return (
    <div className="container mx-auto flex gap-6 py-6 px-4 sm:px-0">
      <LeftSidebar />
      <main className="flex-1">
        <PostFeedContainer />
      </main>
      <RightSidebar />
    </div>
  );
};

export default Home;
