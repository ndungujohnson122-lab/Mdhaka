import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Search, 
  User, 
  Calendar, 
  Tag, 
  X, 
  Check, 
  ChevronRight,
  Info,
  Loader2,
  Image,
  Link,
  UploadCloud,
  Lock,
  Mail
} from "lucide-react";
import { BlogPost } from "../types";

// Dynamic preset images for beautiful blogging
const BLOG_PRESET_IMAGES = [
  {
    name: "Architectural Drafting",
    url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Minimal Living Space",
    url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Modern Kitchen Layout",
    url: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Contemporary Facade",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Scandinavian Cabin",
    url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
  }
];

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Modal and Form states
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Image upload and selection states
  const [imageSourceTab, setImageSourceTab] = useState<"preset" | "upload" | "url">("preset");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [dragActive, setDragActive] = useState<boolean>(false);

  // Registered Editors state
  const [editors, setEditors] = useState<{ id: string; name: string; role: string; email?: string }[]>([]);
  const [loadingEditors, setLoadingEditors] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"list" | "register" | "login">("list");
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: string; email: string; isAdmin: boolean } | null>(() => {
    try {
      const stored = localStorage.getItem("mdhaka_blog_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  
  const [newEditor, setNewEditor] = useState({ name: "", role: "", email: "", password: "" });
  const [loginCreds, setLoginCreds] = useState({ email: "", password: "" });
  const [editorError, setEditorError] = useState<string | null>(null);
  const [editorSuccess, setEditorSuccess] = useState<string | null>(null);

  // New Post Form State
  const [newPost, setNewPost] = useState({
    title: "",
    summary: "",
    content: "",
    category: "Architecture" as BlogPost["category"],
    imageUrl: BLOG_PRESET_IMAGES[0].url,
    author: ""
  });

  const handleFileChange = (file: File) => {
    setUploadError(null);
    if (!file) return;

    // Validate type (PNG or JPG/JPEG only)
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Only JPG or PNG images are supported.");
      return;
    }

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        setNewPost(prev => ({ ...prev, imageUrl: base64 }));
        setUploadedFileName(file.name);
      }
    };
    reader.onerror = () => {
      setUploadError("Could not read image file. Please try another file.");
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const categories = ["All", "Architecture", "Materials", "Smart Home", "Sustainability"];

  useEffect(() => {
    fetchPosts();
    fetchEditors();
  }, []);

  const fetchEditors = async () => {
    try {
      setLoadingEditors(true);
      const res = await fetch("/api/editors");
      if (res.ok) {
        const data = await res.json();
        setEditors(data);
      }
    } catch (err) {
      console.error("Failed to load editors registry", err);
    } finally {
      setLoadingEditors(false);
    }
  };

  const handleEditorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditorError(null);
    setEditorSuccess(null);
    if (!newEditor.name.trim() || !newEditor.role.trim() || !newEditor.email.trim() || !newEditor.password.trim()) {
      setEditorError("Please fill out all fields (Name, Professional Title, Email, and Password).");
      return;
    }

    try {
      const res = await fetch("/api/editors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEditor)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to register editor.");
      }
      setEditors([...editors, data]);
      setEditorSuccess(`Successfully registered "${data.name}" as an active Editor! They can now log in.`);
      
      // Clear form
      setNewEditor({ name: "", role: "", email: "", password: "" });
      // Switch back to active list tab
      setTimeout(() => {
        setActiveModalTab("list");
        setEditorSuccess(null);
      }, 2000);
    } catch (err: any) {
      setEditorError(err.message || "An error occurred.");
    }
  };

  const handleEditorLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditorError(null);
    setEditorSuccess(null);
    if (!loginCreds.email.trim() || !loginCreds.password.trim()) {
      setEditorError("Please enter both email and password.");
      return;
    }

    try {
      const res = await fetch("/api/editors/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginCreds)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      setCurrentUser(data);
      localStorage.setItem("mdhaka_blog_user", JSON.stringify(data));
      setEditorSuccess(`Logged in successfully as ${data.name}!`);
      setLoginCreds({ email: "", password: "" });

      // Automatically set the new post author info to this logged in editor
      if (!data.isAdmin) {
        setNewPost(prev => ({ ...prev, author: `${data.name}, ${data.role}` }));
      }

      // Close modal after a short delay
      setTimeout(() => {
        setIsEditorModalOpen(false);
        setEditorSuccess(null);
      }, 1200);
    } catch (err: any) {
      setEditorError(err.message || "Invalid credentials.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("mdhaka_blog_user");
    setNewPost(prev => ({ ...prev, author: "" }));
  };

  const handleDeleteEditor = async (editorId: string, name: string) => {
    if (!currentUser || !currentUser.isAdmin) {
      alert("Only the System Administrator is authorized to delete editors.");
      return;
    }
    if (!window.confirm(`Are you sure you want to permanently remove "${name}" from the editors registry?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/editors/${editorId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete editor.");
      }
      setEditors(editors.filter(e => e.id !== editorId));
      setEditorSuccess(`Successfully removed "${name}" from the registry.`);
    } catch (err: any) {
      setEditorError(err.message || "An error occurred while deleting.");
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error("Failed to load blog database.");
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message || "Could not retrieve articles.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Only registered editors are authorized to publish blog posts. Please login first using the 'Manage Editors' panel!");
      setIsEditorModalOpen(true);
      setActiveModalTab("login");
      return;
    }

    if (!newPost.title || !newPost.summary || !newPost.content) {
      alert("Please fill in the required fields.");
      return;
    }

    try {
      const payload = {
        ...newPost,
        author: currentUser.isAdmin ? "System Administrator" : `${currentUser.name}, ${currentUser.role}`
      };

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Could not publish blog post.");
      const savedPost = await res.json();
      setPosts([savedPost, ...posts]);
      setIsFormOpen(false);
      // Reset form
      setNewPost({
        title: "",
        summary: "",
        content: "",
        category: "Architecture",
        imageUrl: BLOG_PRESET_IMAGES[0].url,
        author: ""
      });
      setImageSourceTab("preset");
      setUploadedFileName("");
      setUploadError(null);
    } catch (err: any) {
      alert(err.message || "Failed to publish article.");
    }
  };

  const handleDeletePost = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to remove this blog post?")) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not delete blog post.");
      setPosts(posts.filter(p => p.id !== id));
      if (readingPost?.id === id) setReadingPost(null);
    } catch (err: any) {
      alert(err.message || "Failed to delete blog post.");
    }
  };

  // Filter post items matching selections
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === "All" || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Blog Page Title Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-100 dark:border-zinc-800 pb-8 mb-12">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-semibold">
            Industry Notebook
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-5xl text-zinc-900 dark:text-white mt-2 tracking-tight">
            Construction & Style Blog
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 font-light max-w-2xl">
            Read professional insights on sustainable masonry, advanced insulation methods, smart home specifications, and luxury interior design trends.
          </p>

          {/* Active Session Indicator */}
          {currentUser ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/20 px-3 py-1.5 rounded-xl w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>Logged in as <strong className="font-bold">{currentUser.name}</strong> ({currentUser.isAdmin ? "System Administrator" : currentUser.role})</span>
              <span className="text-zinc-300 dark:text-zinc-850">|</span>
              <button 
                onClick={handleLogout} 
                className="underline text-zinc-500 hover:text-red-500 cursor-pointer font-bold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/60 px-3 py-1.5 rounded-xl w-fit">
              <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0"></span>
              <span>Guest Mode (Viewer Only)</span>
              <span className="text-zinc-300 dark:text-zinc-800/60">|</span>
              <button 
                onClick={() => { setIsEditorModalOpen(true); setActiveModalTab("login"); }} 
                className="underline text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold cursor-pointer"
              >
                Log In to Publish
              </button>
            </div>
          )}
        </div>
        <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3 self-start md:self-end">
          <button
            onClick={() => { setIsEditorModalOpen(true); setActiveModalTab("list"); }}
            className="flex items-center justify-center space-x-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 font-display font-medium text-xs tracking-wider uppercase px-5 py-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer shadow-xs"
          >
            <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Manage Editors</span>
          </button>
          
          <button
            onClick={() => {
              if (!currentUser) {
                alert("Only registered editors are authorized to publish blog posts. Please login first!");
                setIsEditorModalOpen(true);
                setActiveModalTab("login");
              } else {
                setIsFormOpen(true);
              }
            }}
            className="flex items-center justify-center space-x-2 bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-display font-medium text-xs tracking-wider uppercase px-5 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        {/* Category Pill Tabs */}
        <div className="flex flex-wrap gap-2 order-2 lg:order-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-medium font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                selectedCategory === cat
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-zinc-900 dark:border-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200/60 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative max-w-md w-full order-1 lg:order-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search articles & guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
          />
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-zinc-400 dark:text-zinc-600 mx-auto" />
          <p className="mt-4 text-zinc-500 dark:text-zinc-400 font-light text-sm">Loading architectural library...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-400 p-6 rounded-2xl max-w-xl mx-auto text-center">
          <Info className="w-8 h-8 mx-auto text-red-500" />
          <p className="mt-3 font-medium text-sm">{error}</p>
          <button 
            onClick={fetchPosts} 
            className="mt-4 text-xs font-mono uppercase tracking-widest underline font-semibold cursor-pointer"
          >
            Retry Loading
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-20 text-center bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <BookOpen className="w-12 h-12 text-zinc-400 mx-auto" />
          <h3 className="mt-4 font-display font-bold text-lg text-zinc-800 dark:text-zinc-200">No articles match your selection</h3>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400 font-light text-sm max-w-md mx-auto">
            Try resetting your search filters or write a brand new blog post using the publisher tool above!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              onClick={() => setReadingPost(post)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min((index % 3) * 0.08, 0.24), ease: "easeOut" }}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-850 rounded-2xl overflow-hidden hover:shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Article Image Banner */}
                <div className="aspect-video relative overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                  <img
                    referrerPolicy="no-referrer"
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-4 left-4 bg-zinc-900/90 dark:bg-zinc-800/95 text-white px-2.5 py-1 rounded-md text-[9px] font-mono uppercase tracking-widest font-semibold backdrop-blur-xs">
                    {post.category}
                  </div>
                  <button
                    onClick={(e) => handleDeletePost(post.id, e)}
                    className="absolute top-4 right-4 bg-white/95 dark:bg-zinc-900/95 text-zinc-500 dark:text-zinc-400 p-2 rounded-lg hover:text-red-600 dark:hover:text-red-400 transition-all shadow-xs"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Text Content */}
                <div className="p-6">
                  <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </span>
                  <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white mt-3 tracking-tight leading-snug">
                    {post.title}
                  </h3>
                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 font-light line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              {/* Read More Footer */}
              <div className="px-6 pb-6 pt-3 flex items-center justify-between text-xs font-mono text-zinc-900 dark:text-zinc-200 border-t border-zinc-50 dark:border-zinc-800/40">
                <span className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                  <span className="truncate max-w-[120px] font-light text-zinc-500 dark:text-zinc-400">{post.author}</span>
                </span>
                <span className="flex items-center space-x-1 hover:translate-x-1 transition-all font-semibold uppercase tracking-wider text-[10px]">
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ================= MODAL: READ FULL POST ================= */}
      {readingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto border border-zinc-100 dark:border-zinc-800">
            {/* Image Banner */}
            <div className="aspect-video relative bg-zinc-100 dark:bg-zinc-950">
              <img
                referrerPolicy="no-referrer"
                src={readingPost.imageUrl}
                alt={readingPost.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setReadingPost(null)}
                className="absolute top-4 right-4 bg-zinc-950/80 text-white p-2 rounded-xl hover:bg-zinc-950 transition-all cursor-pointer backdrop-blur-xs"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 bg-zinc-900/90 text-white px-3 py-1 rounded-md text-[10px] font-mono uppercase tracking-widest backdrop-blur-xs">
                {readingPost.category}
              </div>
            </div>

            {/* Typography */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center space-x-4 text-xs font-mono text-zinc-400 dark:text-zinc-500 mb-4 border-b border-zinc-50 dark:border-zinc-800 pb-4">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{readingPost.date}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{readingPost.author}</span>
                </span>
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight leading-tight">
                {readingPost.title}
              </h2>

              <p className="mt-4 font-mono text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-950 border-l-2 border-zinc-400 dark:border-zinc-600 p-4 leading-relaxed rounded-r-lg font-medium italic">
                "{readingPost.summary}"
              </p>

              {/* Rich body text */}
              <div className="mt-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed font-light space-y-4 whitespace-pre-wrap">
                {readingPost.content}
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-6 mt-8 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  onClick={() => setReadingPost(null)}
                  className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-display font-medium text-xs tracking-wider uppercase px-6 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-sm"
                >
                  Finished Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: WRITE / POST NEW BLOG ================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-zinc-900 dark:text-white">
                Write & Publish an Article
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Innovative Facade Waterproofing"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    Author (Active Session)
                  </label>
                  <div className="flex items-center space-x-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-850 rounded-lg px-3.5 py-2.5 text-sm">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-[10px] font-mono uppercase shrink-0">
                      {currentUser?.name?.charAt(0) || "E"}
                    </div>
                    <div className="text-zinc-900 dark:text-white font-medium text-xs">
                      {currentUser?.name} <span className="text-zinc-400 dark:text-zinc-500 font-mono font-light">({currentUser?.isAdmin ? "System Administrator" : currentUser?.role})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                    Category *
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({ ...newPost, category: e.target.value as any })}
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                  >
                    <option value="Architecture">Architecture</option>
                    <option value="Materials">Materials</option>
                    <option value="Smart Home">Smart Home</option>
                    <option value="Sustainability">Sustainability</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                  Short Article Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="A highly scannable, engaging summary of the architectural insights discussed inside."
                  value={newPost.summary}
                  onChange={(e) => setNewPost({ ...newPost, summary: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 mb-1.5 font-bold">
                  Article Content *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Draft your full construction article or design walkthrough here. Use spacing and paragraphs."
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-sm text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                />
              </div>

              {/* Cover Photo Selector with Tabs */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                  <label className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold">
                    Article Cover Photo *
                  </label>
                  
                  {/* Segmented control tabs */}
                  <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setImageSourceTab("preset");
                        setNewPost({ ...newPost, imageUrl: BLOG_PRESET_IMAGES[0].url });
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                        imageSourceTab === "preset"
                          ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      <Image className="w-3.5 h-3.5" />
                      <span>Presets</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageSourceTab("upload");
                        setNewPost({ ...newPost, imageUrl: "" });
                        setUploadedFileName("");
                        setUploadError(null);
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                        imageSourceTab === "upload"
                          ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImageSourceTab("url");
                        setNewPost({ ...newPost, imageUrl: "" });
                      }}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                        imageSourceTab === "url"
                          ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      }`}
                    >
                      <Link className="w-3.5 h-3.5" />
                      <span>URL Link</span>
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {imageSourceTab === "preset" && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase block mb-1">
                      Choose from our premium architectural presets:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {BLOG_PRESET_IMAGES.map((preset) => {
                        const isSelected = newPost.imageUrl === preset.url;
                        return (
                          <div
                            key={preset.name}
                            onClick={() => setNewPost({ ...newPost, imageUrl: preset.url })}
                            className={`cursor-pointer border-2 rounded-xl overflow-hidden relative transition-all group ${
                              isSelected ? "border-emerald-600 dark:border-emerald-400 scale-[1.02]" : "border-transparent opacity-60 hover:opacity-95"
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              className="w-full h-12 object-cover"
                            />
                            <div className="p-1 text-[8px] text-center bg-zinc-950 dark:bg-black text-white truncate">
                              {preset.name}
                            </div>
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full p-0.5">
                                <Check className="w-2.5 h-2.5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {imageSourceTab === "upload" && (
                  <div className="space-y-3">
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                        dragActive
                          ? "border-emerald-500 bg-emerald-50/10 dark:bg-emerald-950/5"
                          : "border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20"
                      }`}
                    >
                      <input
                        type="file"
                        id="image-upload-input"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload-input"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-xl text-zinc-500 dark:text-zinc-400 group-hover:scale-105 transition-transform">
                          <UploadCloud className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                            Click to select or drag & drop image
                          </p>
                          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                            JPG or PNG only • Max size 15MB
                          </p>
                        </div>
                      </label>
                    </div>

                    {uploadedFileName && (
                      <div className="flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/10 px-4 py-2 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-mono">
                        <span className="truncate max-w-[80%]">✓ {uploadedFileName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewPost({ ...newPost, imageUrl: "" });
                            setUploadedFileName("");
                          }}
                          className="text-[10px] uppercase font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                    )}

                    {uploadError && (
                      <p className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/10 border border-red-100/30 dark:border-red-900/10 px-4 py-2 rounded-xl">
                        ⚠️ {uploadError}
                      </p>
                    )}
                  </div>
                )}

                {imageSourceTab === "url" && (
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase block mb-1">
                      Paste a direct web link to an online image:
                    </span>
                    <input
                      type="url"
                      placeholder="e.g. https://images.unsplash.com/photo-..."
                      value={newPost.imageUrl}
                      onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-zinc-400 dark:focus:outline-zinc-600"
                    />
                  </div>
                )}

                {/* Sub-preview block of the chosen image */}
                {newPost.imageUrl && (
                  <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-2xl flex items-center space-x-4">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 shrink-0">
                      <img
                        src={newPost.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback or error indicator
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                        Selected Cover Preview
                      </span>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono truncate max-w-[280px]">
                        {newPost.imageUrl.startsWith("data:") ? "Local Image Uploaded (Base64)" : newPost.imageUrl}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-display font-medium text-xs tracking-wider uppercase px-6 py-2.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-sm"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: REGISTERED EDITORS & AUTHENTICATION ================= */}
      {isEditorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
              <div>
                <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-white">
                  Editors & Registry Portal
                </h2>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono mt-0.5">
                  Secure publishing credentials & directory access.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditorModalOpen(false);
                  setEditorError(null);
                  setEditorSuccess(null);
                }}
                className="text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SEGMENTED TAB SELECTOR */}
            <div className="flex bg-zinc-100 dark:bg-zinc-950 p-1 rounded-xl mb-6">
              <button
                onClick={() => {
                  setActiveModalTab("list");
                  setEditorError(null);
                  setEditorSuccess(null);
                }}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeModalTab === "list"
                    ? "bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Active List
              </button>
              <button
                onClick={() => {
                  setActiveModalTab("register");
                  setEditorError(null);
                  setEditorSuccess(null);
                }}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeModalTab === "register"
                    ? "bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Register
              </button>
              <button
                onClick={() => {
                  setActiveModalTab("login");
                  setEditorError(null);
                  setEditorSuccess(null);
                }}
                className={`flex-1 text-center py-2 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                  activeModalTab === "login"
                    ? "bg-white dark:bg-zinc-850 text-zinc-900 dark:text-white shadow-xs"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                Log In
              </button>
            </div>

            {editorError && (
              <p className="text-xs text-red-600 dark:text-red-400 font-mono bg-red-50/50 dark:bg-red-950/10 border border-red-100/30 px-3 py-1.5 rounded-lg mb-4">
                ⚠️ {editorError}
              </p>
            )}

            {editorSuccess && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/30 px-3 py-1.5 rounded-lg mb-4">
                ✓ {editorSuccess}
              </p>
            )}

            {/* TAB CONTENT: ACTIVE REGISTRY LIST */}
            {activeModalTab === "list" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase block">
                    Active Registry Directory ({editors.length})
                  </span>
                  {currentUser?.isAdmin && (
                    <span className="text-[9px] bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded font-mono uppercase font-bold border border-red-100/20">
                      Admin Mode Active
                    </span>
                  )}
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {loadingEditors ? (
                    <div className="py-8 text-center">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-400 mx-auto" />
                    </div>
                  ) : editors.length === 0 ? (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light py-4 text-center">No editors registered yet.</p>
                  ) : (
                    editors.map((editor) => (
                      <div 
                        key={editor.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-850 transition-all"
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs font-mono uppercase shrink-0">
                            {editor.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <h4 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">{editor.name}</h4>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono truncate">{editor.role}</p>
                            {editor.email && (
                              <p className="text-[9px] text-zinc-400 dark:text-zinc-600 font-mono">{editor.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md font-mono font-bold border border-emerald-100/30">
                            Authorized
                          </span>
                          {currentUser?.isAdmin && (
                            <button
                              onClick={() => handleDeleteEditor(editor.id, editor.name)}
                              title="Delete Editor"
                              className="text-zinc-400 hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/10 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: REGISTRATION FORM */}
            {activeModalTab === "register" && (
              <form onSubmit={handleEditorSubmit} className="space-y-4">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase block mb-1">
                  Create a New Editor Credentials
                </span>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={newEditor.name}
                      onChange={(e) => setNewEditor({ ...newEditor, name: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Professional Title / Role *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Landscape Architect"
                      value={newEditor.role}
                      onChange={(e) => setNewEditor({ ...newEditor, role: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@mdhakaholding.com"
                      value={newEditor.email}
                      onChange={(e) => setNewEditor({ ...newEditor, email: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="e.g. secret123"
                      value={newEditor.password}
                      onChange={(e) => setNewEditor({ ...newEditor, password: e.target.value })}
                      className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-display font-medium text-[11px] tracking-wider uppercase px-4 py-2.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
                  >
                    Confirm Registration
                  </button>
                </div>
              </form>
            )}

            {/* TAB CONTENT: LOG IN FORM */}
            {activeModalTab === "login" && (
              <form onSubmit={handleEditorLogin} className="space-y-4">
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono uppercase block mb-1">
                  Authenticate Account
                </span>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                      <input
                        type="email"
                        required
                        placeholder="john@mdhakaholding.com"
                        value={loginCreds.email}
                        onChange={(e) => setLoginCreds({ ...loginCreds, email: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={loginCreds.password}
                        onChange={(e) => setLoginCreds({ ...loginCreds, password: e.target.value })}
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3.5 py-2 text-xs text-zinc-900 dark:text-white focus:outline-zinc-400 dark:focus:outline-zinc-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl space-y-1 text-[10px] text-zinc-500 dark:text-zinc-400 leading-normal">
                  <p className="font-semibold text-zinc-700 dark:text-zinc-300">💡 Preloaded accounts for testing:</p>
                  <p>• <strong>Editor:</strong> marcus@mdhakaholding.com (password: <strong>marcus123</strong>)</p>
                  <p>• <strong>Admin:</strong> admin@mdhakaholding.com (password: <strong>admin123</strong>)</p>
                  <p className="text-[9px] text-zinc-400 mt-1 italic">Note: Only Administrators can delete registered editors.</p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-display font-medium text-[11px] tracking-wider uppercase px-5 py-2.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all cursor-pointer shadow-xs"
                  >
                    Access Portal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
