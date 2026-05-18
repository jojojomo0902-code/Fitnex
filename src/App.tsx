import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dumbbell as DumbbellIcon, 
  ChevronRight, 
  User as UserIcon, 
  Briefcase, 
  ShieldCheck,
  Calendar,
  Package,
  LogOut,
  Plus,
  Home,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  QrCode,
  ShoppingCart,
  Users
} from "lucide-react";
import { cn } from "./lib/utils";
import type { User, UserRole, GymClass, Product } from "./types";

// --- Shared Components ---

const Button = ({ children, className, variant = "primary", ...props }: any) => {
  const variants: any = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-[0_4px_12px_rgba(107,33,168,0.3)] hover:shadow-[0_8px_20px_rgba(107,33,168,0.4)] transition-all active:scale-[0.97]",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-[0.97]",
    ghost: "text-text-muted hover:bg-slate-100 transition-colors",
    secondary: "bg-secondary text-white hover:opacity-90 shadow-lg active:scale-[0.97]"
  };
  return (
    <button 
      className={cn("px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 text-[11px] uppercase tracking-[0.1em] transition-all", variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }: any) => (
  <div className={cn("bg-white p-5 rounded-2xl border border-white/50 shadow-premium transition-all duration-300 hover:shadow-premium-hover", className)}>
    {children}
  </div>
);

// --- Sub-Views ---

const Sidebar = ({ role, activeTab, setActiveTab, onLogout }: any) => {
  const tabs = {
    Member: [
      { id: "home", icon: Home, label: "Home" },
      { id: "classes", icon: Calendar, label: "Classes" },
      { id: "checkin", icon: QrCode, label: "Check-In" },
      { id: "products", icon: ShoppingCart, label: "Products" },
      { id: "profile", icon: UserIcon, label: "Profile" },
    ],
    Trainer: [
      { id: "home", icon: Home, label: "Dashboard" },
      { id: "schedule", icon: Calendar, label: "Schedule" },
      { id: "members", icon: Users, label: "Members" },
      { id: "attendance", icon: CheckCircle2, label: "Attendance" },
      { id: "profile", icon: UserIcon, label: "Profile" },
    ],
    Admin: [
      { id: "home", icon: Home, label: "Dashboard" },
      { id: "users", icon: Users, label: "Users" },
      { id: "classes", icon: Calendar, label: "Classes" },
      { id: "inventory", icon: Package, label: "Inventory" },
      { id: "profile", icon: UserIcon, label: "Profile" },
    ]
  };

  const currentTabs = tabs[role as keyof typeof tabs] || [];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-secondary border-t border-white/5 px-4 py-2 md:relative md:w-64 md:h-screen md:border-t-0 flex md:flex-col justify-between z-50 transition-all shadow-2xl md:shadow-none bg-gradient-to-b md:from-secondary md:to-indigo-950">
      <div className="flex md:flex-col w-full justify-around md:justify-start">
        <div className="hidden md:flex flex-col p-8 mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-2xl font-extrabold text-white tracking-tighter relative z-10">
            Fit<span className="text-accent underline decoration-accent/30 underline-offset-4">Nex</span>
          </h1>
          <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em] mt-1.5 relative z-10 font-sans">
            {role} Portal
          </p>
        </div>
        <nav className="flex md:flex-col w-full gap-1 px-3">
          {currentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col md:flex-row items-center gap-3 px-6 py-3.5 transition-all relative rounded-xl group",
                activeTab === tab.id 
                  ? "text-white bg-white/10" 
                  : "text-white/40 hover:text-white hover:bg-white/2"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="hidden md:block absolute left-0 w-1 h-6 bg-accent rounded-full"
                />
              )}
              <tab.icon className={cn("w-6 h-6 md:w-5 md:h-5 transition-colors", activeTab === tab.id ? "text-accent" : "group-hover:text-white")} />
              <span className="text-[10px] md:text-sm font-bold tracking-tight">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <button 
        onClick={onLogout}
        className="hidden md:flex items-center gap-3 px-6 py-4 text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all mt-auto mb-4 mx-3 rounded-xl group"
      >
        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="text-sm font-bold">Sign Out</span>
      </button>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<"splash" | "role" | "login" | "register" | "main">("splash");
  const [selectedRole, setSelectedRole] = useState<UserRole>("Member");
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  
  // Data State
  const [classes, setClasses] = useState<GymClass[]>([
    { id: "1", name: "Morning Yoga", trainer: "Siti Nur", time: "08:00 AM", capacity: 20, booked: 5, category: "Yoga", image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800" },
    { id: "2", name: "High Intensity Cardio", trainer: "Muthu Raja", time: "10:00 AM", capacity: 15, booked: 12, category: "Cardio", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800" },
    { id: "3", name: "Power Lifting", trainer: "Dwayne Ali", time: "05:00 PM", capacity: 10, booked: 8, category: "Strength", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800" },
    { id: "4", name: "Pilates Advance", trainer: "Siti Nur", time: "06:30 PM", capacity: 12, booked: 4, category: "Yoga", image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800" }
  ]);
  const [inventory, setInventory] = useState<Product[]>([
    { id: "1", name: "Whey Protein (Vanilla)", category: "Supplements", stock: 25, price: 50, image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=800" },
    { id: "2", name: "Gym Towel", category: "Merchandise", stock: 50, price: 15, image: "https://images.unsplash.com/photo-1583912267550-d44d2a3ad77a?auto=format&fit=crop&q=80&w=800" },
    { id: "3", name: "Pre-Workout Blaze", category: "Supplements", stock: 5, price: 40, image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=800" },
    { id: "4", name: "FitNex Shaker", category: "Merchandise", stock: 100, price: 12, image: "https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?auto=format&fit=crop&q=80&w=800" },
    { id: "5", name: "Creatine 300g", category: "Supplements", stock: 8, price: 35, image: "https://images.unsplash.com/photo-1550345332-09e3ac987658?auto=format&fit=crop&q=80&w=800" }
  ]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const fetchData = async () => {
    try {
      const classRes = await fetch("/api/classes");
      if (classRes.ok) {
        const data = await classRes.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setClasses(data);
        }
      }
      
      const invRes = await fetch("/api/inventory");
      if (invRes.ok) {
        const data = await invRes.json();
        if (data && Array.isArray(data) && data.length > 0) {
          setInventory(data);
        }
      }

      if (user?.role === "Admin" || user?.role === "Trainer") {
        const statRes = await fetch("/api/admin/stats");
        if (statRes.ok) {
          const stats = await statRes.json();
          setAdminStats(stats);
        }
        
        // Ensure we show some users for dashboard views
        setAllUsers([
          { id: "m-1", name: "Ali Bin Abu", email: "ali@email.com", role: "Member", plan: "Premium", status: "Active", avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=150" },
          { id: "m-2", name: "Ling Mei", email: "ling@email.com", role: "Member", plan: "Basic", status: "Active", avatar: "https://images.unsplash.com/photo-1516523653452-4bab72b99650?auto=format&fit=crop&q=80&w=150" },
          { id: "m-3", name: "Muthu Raja", email: "muthu@email.com", role: "Member", plan: "Premium", status: "Active", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
          { id: "m-4", name: "Amira Zulkifli", email: "amira@email.com", role: "Member", plan: "Premium", status: "Active", avatar: "https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150" },
          { id: "t-1", name: "Siti Nur", email: "siti@fitnex.com", role: "Trainer", status: "Active", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
        ]);
      }
    } catch (e) {
      console.error("Fetch Error:", e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleLogin = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    
    // Allow any login to work instantly for exploration
    const mockUser: User = {
      id: "user-" + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0] || selectedRole,
      email: email || "demo@fitnex.com",
      role: selectedRole,
      plan: selectedRole === "Member" ? "Premium" : undefined,
      status: "Active"
    };
    
    setUser(mockUser);
    setView("main");
  };

  const handleRegister = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    const mockUser: User = {
      id: "new-" + Math.random().toString(36).substr(2, 9),
      name: name || "New Member",
      email: email || "new@fitnex.com",
      role: "Member",
      plan: "Basic",
      status: "Active"
    };

    setUser(mockUser);
    setView("main");
  };

  const handleBook = async (classId: string) => {
    try {
      const res = await fetch("/api/classes/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, classId })
      });
      if (res.ok) {
        alert("Booking successful! Expect to see you there.");
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || "Booking failed");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during booking");
    }
  };

  const handleBuy = async (productId: string) => {
    try {
      const res = await fetch("/api/inventory/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, productId })
      });
      if (res.ok) {
        alert("Purchase successful! Item added to your orders.");
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || "Purchase failed");
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during purchase");
    }
  };

  // --- Renderers ---

  if (view === "splash") {
    return (
      <div className="h-screen bg-secondary flex flex-col items-center justify-center overflow-hidden relative">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920" 
          alt="Gym Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/80 to-transparent" />
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1.5 }}
          className="w-32 h-32 bg-white rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.3)] mb-8 relative z-10 border-4 border-white/20"
        >
          <DumbbellIcon className="w-16 h-16 text-primary" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center relative z-10 flex flex-col items-center"
        >
          <h1 className="text-white text-5xl font-display font-black mb-2 tracking-tighter">Fit<span className="text-accent underline decoration-accent/30 underline-offset-8">Nex</span></h1>
          <p className="text-white/60 font-medium tracking-[0.1em] uppercase text-xs mb-10">"Train Smarter. Manage Better."</p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button 
              variant="primary" 
              onClick={() => setView("role")}
              className="px-10 py-6 text-sm rounded-2xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (view === "role") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <div className="flex items-center gap-3 justify-center mb-12">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <DumbbellIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Welcome to FitNex</h2>
          </div>
          
          <p className="text-center text-slate-500 mb-10 text-lg">Select your role to continue</p>
          
          <div className="space-y-4">
            {[
              { id: "Member", icon: UserIcon, title: "Member", desc: "Book classes & track progress", img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800" },
              { id: "Trainer", icon: Briefcase, title: "Trainer", desc: "Manage classes & members", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800" },
              { id: "Admin", icon: ShieldCheck, title: "Admin", desc: "Full system management", img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800" }
            ].map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ x: 8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedRole(role.id as UserRole); setView("login"); }}
                className="w-full p-6 bg-white rounded-2xl shadow-premium border border-white/50 flex items-center gap-6 text-left group transition-all hover:border-primary/50 hover:shadow-premium-hover relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none">
                  <img src={role.img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors relative z-10">
                  <role.icon className="w-7 h-7 text-slate-400 group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 relative z-10">
                  <h3 className="font-bold text-xl text-slate-900">{role.title}</h3>
                  <p className="text-slate-500 text-sm">{role.desc}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-primary transition-colors relative z-10" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (view === "login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <Card className="w-full max-w-md">
          <button onClick={() => setView("role")} className="text-slate-400 font-medium mb-6 hover:text-primary flex items-center gap-1 transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back
          </button>
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Login as {selectedRole}</h2>
            <p className="text-slate-500">Enter your credentials to access your portal</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input 
                name="password"
                type="password" 
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                <span className="text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-primary font-semibold hover:underline">Forgot Password?</button>
            </div>
            <Button type="submit" className="w-full py-4 text-lg">Login</Button>
            
            {selectedRole === "Member" && (
              <p className="text-center text-slate-500 mt-4">
                New member? <button type="button" onClick={() => setView("register")} className="text-primary font-semibold hover:underline">Join now</button>
              </p>
            )}
          </form>
        </Card>
      </div>
    );
  }

  if (view === "register") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-lg">
          <button onClick={() => setView("login")} className="text-slate-400 font-medium mb-6 hover:text-primary flex items-center gap-1 transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to login
          </button>
          <div className="mb-8">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">New Membership</h2>
            <p className="text-slate-500">Fill in your details to start your journey with us</p>
          </div>
          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
              <input name="name" required className="w-full px-4 py-3 rounded-xl border border-slate-200" placeholder="Ali Abu" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200" placeholder="you@email.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <input name="phone" type="tel" required className="w-full px-4 py-3 rounded-xl border border-slate-200" placeholder="+1 (555) 0000" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Age</label>
              <input name="age" type="number" required className="w-full px-4 py-3 rounded-xl border border-slate-200" placeholder="25" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gender</label>
              <select name="gender" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input name="password" type="password" required className="w-full px-4 py-3 rounded-xl border border-slate-200" placeholder="••••••••" />
            </div>
            <div className="md:col-span-2 pt-2">
              <Button type="submit" className="w-full py-4 text-lg">Create Account</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  const RenderDashboard = () => {
    if (user?.role === "Member") {
      return (
        <div className="space-y-6">
          {activeTab === "home" && (
            <>
              <div className="flex flex-col md:flex-row gap-6">
                <Card className="flex-1 bg-gradient-to-br from-primary via-primary to-accent text-white border-0 overflow-hidden relative shadow-[0_20px_40px_rgba(107,33,168,0.25)] group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-all duration-700" />
                  <div className="relative z-10">
                    <p className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-1.5">Current Membership</p>
                    <h3 className="text-4xl font-display font-bold mb-6 tracking-tight">{user.plan} Subscription</h3>
                    <div className="flex gap-4">
                      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1">Expires On</p>
                        <p className="font-bold text-sm">Dec 2026</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                        <p className="text-[10px] text-white/50 uppercase font-bold tracking-wider mb-1">Status</p>
                        <p className="font-bold text-sm">{user.status}</p>
                      </div>
                    </div>
                  </div>
                  <DumbbellIcon className="absolute -right-8 -bottom-8 w-56 h-56 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                </Card>
                <Card className="md:w-72 flex flex-col items-center justify-center text-center border-2 border-primary/5 hover:border-primary/20 transition-all shadow-premium">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 ring-4 ring-primary/5">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-black text-4xl text-slate-900 tracking-tighter">12</h4>
                  <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest mt-1">Sessions this month</p>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Featured Classes</h3>
                    <button onClick={() => setActiveTab("classes")} className="text-sm font-bold text-primary hover:underline">View All</button>
                  </div>
                  <div className="space-y-3">
                    {classes.slice(0, 2).map((c) => (
                      <Card key={c.id} className="flex items-center justify-between py-4 group cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => handleBook(c.id)}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                            {c.image && <img src={c.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{c.name}</p>
                            <p className="text-xs text-slate-500">{c.time} • {c.trainer}</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                           <Plus className="w-4 h-4" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Recommended Products</h3>
                    <button onClick={() => setActiveTab("products")} className="text-sm font-bold text-primary hover:underline">Shop Now</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {inventory.slice(0, 2).map((item) => (
                      <Card key={item.id} className="p-3 flex flex-col gap-2 group cursor-pointer" onClick={() => handleBuy(item.id)}>
                        <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative">
                           {item.image && <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />}
                           <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur rounded px-1.5 py-0.5 font-bold text-[10px] shadow-sm">${item.price}</div>
                        </div>
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                          <Plus className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-10 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Morning Yoga Session</p>
                        <p className="text-xs text-slate-500">2 days ago • Siti Nur</p>
                      </div>
                    </div>
                    <span className="text-green-500 text-sm font-bold">Attended</span>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === "classes" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classes.map((c) => (
                <Card key={c.id} className="group hover:border-primary/30 transition-all overflow-hidden flex flex-col p-0">
                  <div className="h-32 relative bg-slate-200">
                    {c.image && (
                      <img 
                        src={c.image} 
                        alt={c.name} 
                        className="absolute inset-0 w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-4 left-4 bg-primary text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded shadow-lg">
                      {c.category}
                    </span>
                    <h4 className="absolute bottom-4 left-4 text-white font-display font-bold text-xl drop-shadow-md">{c.name}</h4>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <UserIcon className="w-4 h-4" />
                        <span>{c.trainer}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>{c.time}</span>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="text-slate-500">{c.capacity - c.booked} slots left</span>
                        <span className="font-bold">{Math.round((c.booked/c.capacity)*100)}% Full</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mb-4 overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: `${(c.booked/c.capacity)*100}%` }} />
                      </div>
                      <Button 
                        onClick={() => handleBook(c.id)}
                        className="w-full py-2.5 text-sm"
                        disabled={c.booked >= c.capacity}
                      >
                        {c.booked >= c.capacity ? "Fully Booked" : "Book Spot"}
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "checkin" && (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto h-[70vh]">
              <div className="bg-white p-8 rounded-3xl shadow-premium border-8 border-slate-50 mb-8 relative group">
                <div className="absolute inset-0 bg-accent/5 rounded-2xl animate-pulse -z-10 group-hover:bg-accent/10 transition-colors" />
                <div className="w-56 h-56 flex items-center justify-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-6">
                   <QrCode className="w-full h-full text-slate-800" />
                </div>
              </div>
              <h3 className="text-3xl font-black mb-2 tracking-tight text-slate-900">Your Gym Pass</h3>
              <p className="text-slate-500 mb-8 font-medium">Scan this code at the gym entrance to check-in automatically.</p>
              <div className="flex flex-col gap-3 w-full">
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center justify-between">
                   <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none">Security Token</span>
                   <span className="font-mono font-bold text-primary tracking-tighter">FX-{user?.id.toUpperCase()}-VAL</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {inventory.map((item) => (
                <Card key={item.id} className="flex flex-col p-0 overflow-hidden group hover:border-primary/50 transition-all border-white/50">
                   <div className="bg-slate-100 h-48 flex items-center justify-center relative overflow-hidden">
                     <div className="absolute top-3 right-3 z-20">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest shadow-sm",
                          item.stock > 0 ? "bg-white/90 text-slate-900" : "bg-red-500 text-white"
                        )}>
                          {item.stock > 0 ? "In Stock" : "Sold Out"}
                        </span>
                     </div>
                     {item.image ? (
                       <img 
                         src={item.image} 
                         alt={item.name} 
                         className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                         referrerPolicy="no-referrer"
                       />
                     ) : (
                       <Package className="w-12 h-12 text-slate-300" />
                     )}
                     <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                   </div>
                   <div className="p-5 flex-1 flex flex-col">
                     <div className="mb-4">
                       <p className="text-[10px] text-primary font-black uppercase tracking-[0.15em] mb-1">{item.category}</p>
                       <h4 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-primary transition-colors">{item.name}</h4>
                     </div>
                     <div className="mt-auto flex items-center justify-between">
                       <span className="font-black text-xl text-slate-900 tracking-tighter">${item.price}</span>
                       <Button 
                         variant="primary" 
                         onClick={() => handleBuy(item.id)}
                         className="h-10 w-10 p-0 rounded-full shadow-lg hover:rotate-90 transition-all duration-300" 
                         disabled={item.stock === 0}
                       >
                         <Plus className="w-5 h-5" />
                       </Button>
                     </div>
                   </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="flex flex-col items-center text-center p-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />
                  <div className="w-24 h-24 bg-white shadow-xl rounded-full flex items-center justify-center mb-6 border border-slate-50 ring-8 ring-primary/5">
                    {user.avatar ? (
                      <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="w-10 h-10 text-primary" />
                    )}
                  </div>
                  <h3 className="text-3xl font-extrabold tracking-tight text-slate-900">{user.name}</h3>
                  <p className="text-slate-400 font-medium">{user.email}</p>
                  <div className="flex gap-2 mt-6">
                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest border border-primary/20">
                      {user.role}
                    </span>
                    {user.plan && (
                      <span className="px-4 py-1.5 bg-green-50 text-green-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-green-200">
                        {user.plan} Plan
                      </span>
                    )}
                  </div>
                </Card>
              <Card className="divide-y divide-slate-100 p-0 overflow-hidden">
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                  <span className="text-sm font-medium">Personal Information</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                  <span className="text-sm font-medium">Membership Details</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                  <span className="text-sm font-medium">Payment History</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer">
                  <span className="text-sm font-medium">Settings</span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </Card>
              <Button variant="outline" className="w-full text-red-500 border-red-100 hover:bg-red-50" onClick={() => { setUser(null); setView("role"); }}>
                Log Out
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (user?.role === "Trainer") {
      return (
        <div className="space-y-6">
          {activeTab === "home" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4 border-l-4 border-l-blue-500">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Today's Classes</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">4</p>
                  </div>
                </Card>
                <Card className="flex items-center gap-4 border-l-4 border-l-green-500">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Participants</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">48</p>
                  </div>
                </Card>
                <Card className="flex items-center gap-4 border-l-4 border-l-purple-500">
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Assigned Progress</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">82%</p>
                  </div>
                </Card>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mt-8">Upcoming Sessions</h3>
              <div className="space-y-4">
                {classes.filter(c => c.trainer.includes("Siti") || c.trainer.includes("Trainer")).map((c, i) => (
                  <Card key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {c.image ? (
                        <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                          <img src={c.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center uppercase font-bold text-slate-500">
                          {c.time.split(":")[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-lg text-slate-900">{c.name}</h4>
                        <p className="text-sm text-slate-500 font-medium">{c.booked} members • {c.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" className="text-xs py-2">View List</Button>
                      <Button className="text-xs py-2" onClick={() => setActiveTab("attendance")}>Mark Attendance</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {activeTab === "schedule" && (
            <Card className="p-0 overflow-hidden">
               <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="font-bold">May 2026</h3>
                 <div className="flex gap-2">
                    <Button variant="outline" className="p-2 h-auto"><ChevronRight className="w-4 h-4 rotate-180" /></Button>
                    <Button variant="outline" className="p-2 h-auto"><ChevronRight className="w-4 h-4" /></Button>
                 </div>
               </div>
               <div className="p-6">
                 <div className="grid grid-cols-7 gap-4 mb-4 text-center">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                      <span key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</span>
                    ))}
                 </div>
                 <div className="grid grid-cols-7 gap-4">
                   {Array.from({ length: 31 }).map((_, i) => (
                     <div key={i} className={cn(
                       "aspect-square rounded-lg flex flex-col items-center justify-center border transition-all cursor-pointer",
                       i + 1 === 15 ? "bg-primary border-primary text-white" : "bg-white border-slate-100 hover:border-primary/30"
                     )}>
                       <span className="text-sm font-bold">{i + 1}</span>
                       {(i + 1 === 15 || i + 1 === 16 || i + 1 === 18) && <div className={cn("w-1 h-1 rounded-full mt-1", i + 1 === 15 ? "bg-white" : "bg-primary")} />}
                     </div>
                   ))}
                 </div>
               </div>
            </Card>
          )}

          {activeTab === "members" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Assigned Members</h3>
                <div className="flex gap-2">
                  <input type="text" placeholder="Search members..." className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allUsers.filter(u => u.role === "Member").map((m: any) => (
                  <Card key={m.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {m.avatar ? (
                        <img src={m.avatar} alt="" className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <UserIcon className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 leading-tight">{m.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{m.plan} • {m.status}</p>
                      </div>
                    </div>
                    <Button variant="outline" className="text-xs px-3">Assign Workout</Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <Card className="p-0 overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                 <div>
                   <h3 className="font-bold text-lg">Morning Yoga</h3>
                   <p className="text-xs text-slate-500">Today, 08:00 AM • 5 Members</p>
                 </div>
                 <Button className="text-xs">Save Changes</Button>
               </div>
               <div className="divide-y divide-slate-100">
                  {allUsers.filter(u => u.role === "Member").map((m: any) => (
                    <div key={m.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                         {m.avatar ? (
                           <img src={m.avatar} alt="" className="w-8 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                         ) : (
                           <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                             <UserIcon className="w-4 h-4" />
                           </div>
                         )}
                         <span className="font-medium text-sm">{m.name}</span>
                      </div>
                      <div className="flex gap-2">
                         <button className="px-3 py-1 rounded-lg border border-green-500 text-green-600 text-xs font-bold bg-green-50">Present</button>
                         <button className="px-3 py-1 rounded-lg border border-slate-200 text-slate-400 text-xs font-bold">Absent</button>
                      </div>
                    </div>
                  ))}
               </div>
            </Card>
          )}

          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <Card className="flex flex-col items-center text-center p-10">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <UserIcon className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <p className="text-slate-500">{user.email}</p>
                <span className="mt-4 px-3 py-1 bg-primary/5 text-primary text-xs font-bold rounded-full uppercase tracking-widest">
                  {user.role}
                </span>
              </Card>
            </div>
          )}
        </div>
      );
    }

    if (user?.role === "Admin") {
      return (
        <div className="space-y-8">
          {activeTab === "home" && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <Card className="p-4 md:p-6 bg-primary text-white border-0 shadow-lg relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
                  <Users className="w-6 h-6 mb-2 opacity-80 relative z-10" />
                  <p className="text-[10px] md:text-xs opacity-80 uppercase tracking-wider font-bold relative z-10">Total Members</p>
                  <h4 className="text-2xl md:text-3xl font-display font-bold relative z-10">{adminStats?.totalMembers || 0}</h4>
                </Card>
                <Card className="p-4 md:p-6 border-l-4 border-l-green-500">
                  <TrendingUp className="w-6 h-6 mb-2 text-green-500" />
                  <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-bold">Revenue Today</p>
                  <h4 className="text-2xl md:text-3xl font-display font-bold">${adminStats?.todayRevenue || 0}</h4>
                </Card>
                <Card className="p-4 md:p-6 border-l-4 border-l-primary">
                  <Calendar className="w-6 h-6 mb-2 text-primary" />
                  <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-bold">Active Classes</p>
                  <h4 className="text-2xl md:text-3xl font-display font-bold">{adminStats?.activeClasses || 0}</h4>
                </Card>
                <Card className={cn("p-4 md:p-6 border-l-4", (adminStats?.inventoryAlerts || 0) > 0 ? "border-l-red-500 bg-red-50/30" : "border-l-slate-200")}>
                  <AlertTriangle className={cn("w-6 h-6 mb-2", (adminStats?.inventoryAlerts || 0) > 0 ? "text-red-500" : "text-slate-300")} />
                  <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider font-bold">Stock Alerts</p>
                  <h4 className="text-2xl md:text-3xl font-display font-bold">{adminStats?.inventoryAlerts || 0}</h4>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 font-display">Inventory Status</h3>
                    <Button variant="ghost" className="text-xs h-8" onClick={() => setActiveTab("inventory")}>Manage All</Button>
                  </div>
                  <Card className="overflow-hidden p-0">
                    <table className="w-full text-left font-sans">
                      <thead className="bg-slate-50 border-bottom border-slate-100">
                        <tr>
                          <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-400">Item</th>
                          <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-400 text-center">Stock</th>
                          <th className="px-6 py-3 text-[10px] uppercase font-bold text-slate-400 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {inventory.slice(0, 3).map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                              <p className="text-[10px] text-slate-500">{item.category}</p>
                            </td>
                            <td className="px-6 py-4 text-center font-mono text-sm">{item.stock}</td>
                            <td className="px-6 py-4 text-right">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                item.stock < 10 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                              )}>
                                {item.stock < 10 ? "Low Stock" : "Healthy"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900 font-display">Popular Classes</h3>
                    <Button variant="outline" className="text-xs h-8 px-3" onClick={() => setActiveTab("classes")}>Manage</Button>
                  </div>
                  <div className="space-y-3">
                    {classes.sort((a,b) => b.booked - a.booked).slice(0, 3).map((c) => (
                      <Card key={c.id} className="flex items-center justify-between py-4">
                        <div className="flex items-center gap-4">
                          {c.image ? (
                            <img src={c.image} alt="" className="w-10 h-10 rounded-xl object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center font-bold text-sm">
                              {c.booked}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{c.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400">{Math.round((c.booked/c.capacity)*100)}% Booked</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-bold">User Management</h3>
                 <Button><Plus className="w-4 h-4" /> Add New User</Button>
               </div>
               <Card className="p-0 overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                       <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {allUsers.map((u: any) => (
                         <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 text-sm">
                             <div className="flex items-center gap-3">
                               {u.avatar ? (
                                 <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                               ) : (
                                 <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                   <UserIcon className="w-4 h-4" />
                                 </div>
                               )}
                               <div>
                                 <p className="font-bold">{u.name}</p>
                                 <p className="text-slate-400 font-medium text-xs">{u.email}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4">
                              <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase", u.role === "Trainer" ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600")}>
                                {u.role}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-1.5">
                               <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                               <span className="text-sm font-medium">Active</span>
                             </div>
                           </td>
                           <td className="px-6 py-4 text-right">
                             <Button variant="ghost" className="p-1.5 min-h-0"><ChevronRight className="w-4 h-4" /></Button>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </Card>
            </div>
          )}

          {activeTab === "classes" && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-bold">Class Schedules</h3>
                 <Button><Plus className="w-4 h-4" /> Create Class</Button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {classes.map(c => (
                  <Card key={c.id} className="overflow-hidden p-0 flex flex-col sm:flex-row">
                    <div className="w-full sm:w-32 h-32 sm:h-auto bg-slate-200 shrink-0">
                      {c.image && <img src={c.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <div className="p-5 flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg">{c.name}</h4>
                          <p className="text-xs text-slate-500 font-medium">{c.trainer} • {c.time}</p>
                        </div>
                        <Button variant="outline" className="p-2 h-auto text-[10px] uppercase font-bold tracking-widest">Edit</Button>
                      </div>
                      <div className="px-5 py-4 bg-slate-50 flex items-center justify-between mt-auto">
                        <div className="flex gap-4">
                          <div className="text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Booked</p>
                            <p className="font-bold text-primary">{c.booked}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Capacity</p>
                            <p className="font-bold text-slate-900">{c.capacity}</p>
                          </div>
                        </div>
                        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${(c.booked/c.capacity)*100}%` }} />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
               </div>
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-bold">Stock Management</h3>
                 <Button><Plus className="w-4 h-4" /> Add Item</Button>
               </div>
               <Card className="p-0 overflow-hidden">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                       <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Stock</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4 text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {inventory.map(item => (
                         <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                               <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                 {item.image ? (
                                   <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                 ) : (
                                   <Package className="w-5 h-5 text-slate-300" />
                                 )}
                               </div>
                               <div>
                                 <p className="font-bold text-sm tracking-tight">{item.name}</p>
                                 <p className="text-[10px] text-slate-400 uppercase font-bold">{item.category}</p>
                               </div>
                             </div>
                           </td>
                           <td className="px-6 py-4 font-mono text-sm">{item.stock}</td>
                           <td className="px-6 py-4 font-bold text-sm text-primary">${item.price}</td>
                           <td className="px-6 py-4 text-right text-xs">
                             <span className={cn("px-2 py-0.5 rounded font-bold uppercase", item.stock < 10 ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600")}>
                               {item.stock < 10 ? "Low Stock" : "OK"}
                             </span>
                           </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </Card>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-2xl mx-auto space-y-6 text-center">
              <Card className="p-10">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{user.name}</h3>
                <p className="text-slate-500">{user.email}</p>
              </Card>
              <Card className="p-6 text-left space-y-4">
                 <h4 className="font-bold border-b border-slate-100 pb-2">System Settings</h4>
                 <div className="flex items-center justify-between">
                    <span className="text-sm">Allow new member self-registration</span>
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-generate inventory reports</span>
                    <input type="checkbox" className="rounded text-primary" />
                 </div>
              </Card>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (view === "main") {
    return (
      <div className="flex flex-col md:flex-row min-h-screen bg-background">
        <Sidebar 
          role={user?.role} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={() => { setUser(null); setView("role"); }} 
        />
        <main className="flex-1 pb-24 md:pb-8 p-6 md:p-10 md:overflow-y-auto h-screen">
          <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{user?.role} Active</p>
              </div>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tighter">
                {activeTab === "home" ? `Morning, ${user?.name.split(" ")[0]}!` : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 w-full md:w-auto border-r border-slate-200 pr-6 mr-2 hidden lg:flex">
                <div className="relative flex-1 md:flex-none">
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="w-full md:w-48 bg-slate-100 border-none rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-slate-900 leading-none">{user?.name}</p>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 opacity-70">Online</p>
                </div>
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-primary font-bold shadow-sm group-hover:shadow-md transition-shadow">
                  {user?.name.charAt(0)}
                </div>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <RenderDashboard />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  return null;
}
