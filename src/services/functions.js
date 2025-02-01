import { supabase } from "./supabase";


export const getProjects = async (userId) => {
    const { data, error } = await supabase
    .from('projects')
    .select()  
  
    if (error) {
      console.error('Error al obtener proyectos:', error);
      return { error };
    }
    return { data };
  };

  export const getCertificates = async (userId) => {
    const { data, error } = await supabase
    .from('certificates')
    .select()  
  
    if (error) {
      console.error('Error al obtener certificates:', error);
      return { error };
    }
    return { data };
  };