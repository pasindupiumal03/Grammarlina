"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setAuth, authSelector } from "@/lib/slices/auth-slice";
import { getMe } from "@/api/auth";
import { Loader2, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "@/lib/store";
import { useSelector } from "react-redux";

// Beautiful loading animation component
function RouteLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background animation elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>
      
      {/* Main loading content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo with animation */}
        <motion.div 
          className="relative"
          animate={{ 
            rotate: [0, 5, -5, 0],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
          </div>
          <motion.div 
            className="absolute -top-1 -right-1"
            animate={{ 
              y: [0, -8, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Zap className="w-5 h-5 text-accent" />
          </motion.div>
        </motion.div>
        
        {/* App name */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">Grammarlina</h1>
          <motion.p 
            className="text-sm text-muted-foreground"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Preparing your workspace...
          </motion.p>
        </motion.div>
        
        {/* Loading dots animation */}
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{ 
                  y: [0, -8, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "100%", "0%"] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

function RouteDecision() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(authSelector);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [isRehydrated, setIsRehydrated] = useState(false);

  // Wait for redux-persist to rehydrate
  useEffect(() => {
    const checkRehydration = () => {
      // PersistGate ensures this component only renders after rehydration
      setIsRehydrated(true);
    };

    checkRehydration();
  }, []);

  useEffect(() => {
    // Only run after we've confirmed rehydration
    if (!isRehydrated) return;

    const initializeRouting = async () => {
      try {
        //check authState first.
        if(authState._id) {
          return router.push("/dashboard");
        } else {
          return router.push("/home");
        }


        const response = await getMe();
        if (response.success) return router.push("/dashboard");
        else return router.push("/home");
      } catch (error) {
        return router.push("/home");
      } finally {
        setHasCheckedAuth(true);
      }
    };

    initializeRouting();
  }, [isRehydrated, router, dispatch, authState.authToken, authState._id]);

  // Show loading while determining route
  if (!isRehydrated || !hasCheckedAuth) {
    return <RouteLoading />;
  }

  // This will rarely be reached due to router.replace above
  return <RouteLoading />;
}

export default function RootPage() {
  return (
    <PersistGate loading={<RouteLoading />} persistor={persistor}>
      <RouteDecision />
    </PersistGate>
  );
}
