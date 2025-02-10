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

// Subir imagen (para un solo archivo) al bucket de Supabase y retornar su URL pública
// functions.js
export const uploadImage = async (file) => {
  if (!file) return { data: null, error: 'No file provided' };

  try {
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const { error: uploadError } = await supabase.storage
      .from('profileImg')
      .upload(fileName, file);

    if (uploadError) return { data: null, error: uploadError.message };

    const { data: { publicUrl } } = await supabase.storage
      .from('profileImg')
      .getPublicUrl(fileName);

    return { data: publicUrl, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const createComment = async (commentData) => {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select('*');

    return error 
      ? { data: null, error: error.message }
      : { data: data[0], error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

export const fetchComments = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return { error };
  }
  return { data };
};

export const subscribeToComments = (onNewComment) => {
  // Crea un canal para escuchar los cambios en la tabla 'comments'
  const subscription = supabase
    .channel('comments-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',  
        table: 'comments',
      },
      (payload) => {
        // Llama al callback pasando el nuevo comentario
        onNewComment(payload.new);
      }
    )
    .subscribe();

  return subscription;
};

export const removeCommentsSubscription = (subscription) => {
  supabase.removeChannel(subscription);
};
