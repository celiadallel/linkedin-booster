import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/context";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Form validation schema
const postFormSchema = z.object({
  postUrl: z.string().url("Veuillez entrer une URL LinkedIn valide"),
  postContent: z.string()
    .min(10, "Le contenu du post doit contenir au moins 10 caractères")
    .max(5000, "Le contenu du post ne doit pas dépasser 5000 caractères")
});

type PostFormValues = z.infer<typeof postFormSchema>;

export default function AddPost() {
  const { addPost } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Set up form with validation
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      postUrl: "",
      postContent: ""
    },
  });

  // Handle form submission
  const onSubmit = async (data: PostFormValues) => {
    try {
      setIsSubmitting(true);
      
      await addPost(data.postUrl, data.postContent);
      
      toast.success("Post ajouté avec succès", {
        description: "Vous pouvez maintenant générer des commentaires pour ce post."
      });
      
      // Navigate to explore page
      navigate("/explore");
    } catch (error) {
      toast.error("Erreur lors de l'ajout du post", {
        description: "Veuillez réessayer plus tard."
      });
      console.error("Error adding post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Ajouter un nouveau post</h1>
          <p className="text-muted-foreground">
            Saisissez les détails du post LinkedIn pour lequel vous souhaitez générer des commentaires.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Détails du post</CardTitle>
            <CardDescription>
              Entrez l'URL et le contenu de votre post LinkedIn.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="postUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL du post LinkedIn</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://www.linkedin.com/posts/username_title-activity-id" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Collez l'URL complète de votre post LinkedIn.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenu du post</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Copiez le contenu textuel de votre post LinkedIn ici..." 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Copiez le texte complet de votre post pour obtenir des commentaires plus pertinents.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/")}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Ajout en cours..." : "Ajouter le post"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Conseils pour de meilleurs commentaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Incluez le texte complet</p>
                <p className="text-sm text-muted-foreground">
                  Copiez l'intégralité du contenu de votre post pour obtenir des commentaires pertinents.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Mentionnez les mots-clés importants</p>
                <p className="text-sm text-muted-foreground">
                  Si votre post contient des hashtags ou des mots-clés spécifiques, assurez-vous de les inclure.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Vérifiez le lien</p>
                <p className="text-sm text-muted-foreground">
                  Assurez-vous que l'URL du post est correcte et accessible publiquement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}