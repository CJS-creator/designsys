import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { supabase } from "@/integrations/supabase/client";
import { monitor } from "./monitoring";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function invokeWithRetry(name: string, options: any, retries = 2, delay = 1500): Promise<any> {
    const result = await supabase.functions.invoke(name, options);
  
    // Retry on network errors or 5xx/429 status codes if possible to detect
    // supabase-js error object usually contains status
    const status = (result.error as any)?.status;
    const shouldRetry = result.error && (retries > 0) && (!status || status >= 500 || status === 429);
  
    if (shouldRetry) {
      monitor.warn(`Function ${name} failed with status ${status}, retrying... (${retries} left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return invokeWithRetry(name, options, retries - 1, delay * 2);
    }
  
    return result;
}
