import Image from "next/image";
import Link from "next/link";
import { Calendar, User, Share2 } from "lucide-react";
import { GetStaticProps, GetStaticPaths } from "next";

interface BlogPost {
  id: string;
  category: string;
  title: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
}

interface BlogDetailPageProps {
  blogPost: BlogPost;
}

// Mock blog data - in real app, fetch from API/database
const getBlogPost = (id: string) => {
  const posts = {
    "1": {
      id: "1",
      category: "LIVESTOCKS",
      title: "The Importance of Livestock in Modern Farming 2025",
      image: "/assets/blog1.png",
      author: "Basäm",
      date: "3 Nov 2025",
      readTime: "5 min read",
    },
    "2": {
      id: "2",
      category: "UNCATEGORIZED",
      title: "Agro-Business & Entrepreneurship",
      image: "/assets/blog2.png",
      author: "sinan",
      date: "3 Nov 2025",
      readTime: "4 min read",
    },
    "3": {
      id: "3",
      category: "FISHERY",
      title: "Success Stories & Fishermen Spotlight",
      image: "/assets/blog3.png",
      author: "Basäm",
      date: "3 Nov 2025",
      readTime: "6 min read",
    },
    "4": {
      id: "4",
      category: "FRUITS",
      title: "Market Trends & Prices",
      image: "/assets/blog4.png",
      author: "sinan",
      date: "3 Nov 2025",
      readTime: "3 min read",
    },
  };
  
  return posts[id as keyof typeof posts] || posts["1"];
};

const trendingPosts = [
  {
    id: "1",
    title: "Corn Casserole from Scratch",
    image: "/assets/blog1.png",
    category: "Recipes",
  },
  {
    id: "2",
    title: "How to Blanch Vegetables the Right Way",
    image: "/assets/blog2.png",
    category: "Kitchen",
  },
  {
    id: "3",
    title: "Caprese Salad Dish with Olives",
    image: "/assets/blog3.png",
    category: "Recipes",
  },
  {
    id: "4",
    title: "Arame Apple Salad with Ginger",
    image: "/assets/blog4.png",
    category: "Recipes",
  },
];

const relatedImages = [
  "/assets/blog2.png",
  "/assets/blog3.png",
];

const categories = [
  { name: "Oils & Feeds", count: 8, icon: "🌾" },
  { name: "Pet Care", count: 6, icon: "🐾" },
  { name: "Meat & Seafood", count: 5, icon: "🥩" },
  { name: "Washing items", count: 4, icon: "🧼" },
  { name: "Fresh Fruit", count: 7, icon: "🍎" },
];

const popularTags = [
  "Healthy",
  "Shopping",
  "Fruit",
  "Snacks",
  "Vegetable",
  "Appetizer",
];

// This generates the paths at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = ["1", "2", "3", "4"].map((id) => ({
    params: { id },
  }));

  return {
    paths,
    fallback: false, // Set to 'blocking' if you want to generate pages on-demand
  };
};

// This fetches the data for each page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const blogPost = getBlogPost(params?.id as string);

  return {
    props: {
      blogPost,
    },
  };
};

export default function BlogDetailPage({ blogPost }: BlogDetailPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-emerald-600 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:underline">Livestock</Link>
            <span>/</span>
            <span>Blog Details</span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8">
            {/* Article Content */}
            <article className="max-w-3xl">
              {/* Category Badge */}
              <span className="inline-block bg-emerald-100 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-medium mb-4 uppercase">
                {blogPost.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {blogPost.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      By {blogPost.author}
                    </p>
                    <p className="text-xs text-gray-500">{blogPost.readTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{blogPost.date}</span>
                </div>
                {/* <button className="ml-auto flex items-center gap-2 text-emerald-600 hover:text-emerald-700">
                  <Share2 className="w-4 h-4" />
                </button> */}
              </div>

              {/* Featured Image */}
              <div className="relative aspect-[16/10] mb-8 rounded-2xl overflow-hidden">
                <Image
                  src={blogPost.image}
                  alt={blogPost.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-cover"
                />
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed mb-6 text-base">
                  Livestock farming has always been at the heart of agriculture.
                  Beyond providing food such as milk, meat and eggs, livestock
                  supports the livelihoods of millions of farmers worldwide.
                </p>

                <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">
                  Why Livestock Matters
                </h3>
                <ul className="space-y-3 mb-6 list-disc pl-6">
                  <li className="text-gray-700 text-base">
                    <strong>Food Security:</strong> Cattle, goats, pigs, and
                    poultry are major sources of animal protein and essential
                    nutrients.
                  </li>
                  <li className="text-gray-700 text-base">
                    <strong>Income Generation:</strong> For many rural families,
                    selling livestock products provides critical income.
                  </li>
                  <li className="text-gray-700 text-base">
                    <strong>Farming Support:</strong> In many communities,
                    animals such as oxen are used for plowing fields and
                    transporting goods.
                  </li>
                  <li className="text-gray-700 text-base">
                    <strong>By-Products:</strong> Livestock also provide
                    leather, wool, and manure, which can be used for compost and
                    fertilizer.
                  </li>
                </ul>
              </div>

              {/* Related Images */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {relatedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Related ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* More Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-base">
                  These blends remain popular in cuisines around the world as
                  diners embrace global flavors and regional traditions. It's
                  hard to beat a hearty home favorite inspired by diverse global
                  cultures at events. Ut irure incididunt ut labore et dolore
                  magna aliqua et magna aliqua ut adipiscing et elit. Ut ex ex
                  ut labore et dolore ut esse sed magna incididunt ut sunt in
                  culpa magna aliqua ex do ut sunt.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-gray-700 leading-relaxed text-base">
                  Integer eu facilisis dolor. Ut venenatis tincidunt diam
                  elementum imperdiet. Etiam accumsan semper nisl eu congue.
                  Sed diam augue, rhoncus sit amet venenatis non, volutpat sit
                  amet lectus. Quisque vestibulum nunc in tortor facilisis
                  lacus rhoncus id.
                </p>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Category Widget */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Category
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-emerald-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <span className="text-base">{category.icon}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {category.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Now */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Trending Now
                </h3>
                <div className="space-y-4">
                  {trendingPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.id}`}
                      className="flex gap-3 group"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1">
                          {post.title}
                        </h4>
                        <span className="text-xs text-emerald-600">
                          {post.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-medium"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}