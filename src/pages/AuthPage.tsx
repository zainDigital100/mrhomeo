import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Leaf, 
  Mail, 
  Lock, 
  ArrowRight, 
  LogIn, 
  UserPlus,
  Sparkles,
  History,
  User,
  Phone,
  Calendar
} from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");
const fullNameSchema = z.string().min(2, "Name must be at least 2 characters").optional().or(z.literal(""));
const ageSchema = z.string().refine(val => !val || (parseInt(val) >= 1 && parseInt(val) <= 150), {
  message: "Age must be between 1 and 150"
}).optional();
const phoneSchema = z.string().optional();

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    fullName?: string;
    age?: string;
    phone?: string;
  }>({});
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/ai-treatment");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }

    if (!isLogin) {
      if (fullName) {
        const fullNameResult = fullNameSchema.safeParse(fullName);
        if (!fullNameResult.success) {
          newErrors.fullName = fullNameResult.error.errors[0].message;
        }
      }
      
      if (age) {
        const ageResult = ageSchema.safeParse(age);
        if (!ageResult.success) {
          newErrors.age = ageResult.error.errors[0].message;
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        
        if (error) {
          let message = error.message;
          if (error.message.includes("Invalid login credentials")) {
            message = "Invalid email or password. Please try again.";
          }
          
          toast({
            title: "Error",
            description: message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You're now signed in.",
          });
          navigate("/ai-treatment");
        }
      } else {
        // Sign up
        const { error } = await signUp(email, password);
        
        if (error) {
          let message = error.message;
          if (error.message.includes("User already registered")) {
            message = "This email is already registered. Please sign in instead.";
          }
          
          toast({
            title: "Error",
            description: message,
            variant: "destructive"
          });
        } else {
          // Wait a moment for the auth trigger to create the profile
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Update profile with additional data if provided
          if (fullName || age || gender || phone) {
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
              await supabase
                .from('profiles')
                .update({
                  full_name: fullName || null,
                  age: age ? parseInt(age) : null,
                  gender: gender || null,
                  phone: phone || null,
                })
                .eq('user_id', userData.user.id);
            }
          }
          
          toast({
            title: "Account created!",
            description: "You're now signed in. Your chat history will be saved.",
          });
          navigate("/ai-treatment");
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-8">
            <motion.div 
              className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-soft"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? "Sign in to access your chat history" 
                : "Sign up to save your consultations"}
            </p>
          </motion.div>

          {/* Benefits */}
          <motion.div 
            variants={fadeInUp}
            className="bg-secondary/50 rounded-xl p-4 mb-6 border border-border"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <History className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Save Your Consultations
                </p>
                <p className="text-xs text-muted-foreground">
                  Your chat history will be saved so you can continue conversations later.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            variants={fadeInUp}
            className="bg-card rounded-2xl p-6 sm:p-8 shadow-card border border-border"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-xs text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                    aria-invalid={!!errors.password}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                </div>
                {errors.password && (
                  <p id="password-error" className="text-xs text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Additional fields for sign up */}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 pt-2"
                >
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-muted-foreground mb-3">Optional: Help us personalize your experience</p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors(prev => ({ ...prev, fullName: undefined }));
                        }}
                        className={`pl-10 ${errors.fullName ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-xs text-destructive">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Age & Gender Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="age" className="text-sm font-medium">
                        Age
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="age"
                          type="number"
                          placeholder="25"
                          min={1}
                          max={150}
                          value={age}
                          onChange={(e) => {
                            setAge(e.target.value);
                            if (errors.age) setErrors(prev => ({ ...prev, age: undefined }));
                          }}
                          className={`pl-10 ${errors.age ? 'border-destructive' : ''}`}
                        />
                      </div>
                      {errors.age && (
                        <p className="text-xs text-destructive">{errors.age}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium">
                        Gender
                      </Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.span>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                    {isLogin ? "Sign In" : "Create Account"}
                  </span>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrors({});
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </motion.div>

          {/* Continue without signing in */}
          <motion.div variants={fadeInUp} className="mt-6 text-center">
            <Link 
              to="/ai-treatment" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Continue without signing in
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
