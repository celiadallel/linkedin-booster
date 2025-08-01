import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/context";
import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

export default function Explore() {
  const { explorePosts, generateComments, selectComment, isLoading } = useApp();
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [processingPostId, setProcessingPostId] = useState<string | null>(null);
  const navigate = useNavigate();

  // Generate comments for a post
  const handleGenerateComments = async (postId: string, content: string) => {
    try {
      setProcessingPostId(postId);
      await generateComments(postId, content);
      setActivePostId(postId);
      toast.success("Commentaires générés avec succès", {
        description: "Choisissez le commentaire que vous préférez."
      });
    } catch (error) {
      toast.error("Erreur lors de la génération des commentaires", {
        description: "Veuillez réessayer plus tard."
      });
      console.error("Error generating comments:", error);
    } finally {
      setProcessingPostId(null);
    }
  };

  // Select a comment for a post
  const handleSelectComment = async (postId: string, commentIndex: number) => {
    try {
      setProcessingPostId(postId);
      await selectComment(postId, commentIndex);
      toast.success("Commentaire sélectionné avec succès", {
        description: "Vous pouvez maintenant l'utiliser sur LinkedIn."
      });
      setActivePostId(null);
    } catch (error) {
      toast.error("Erreur lors de la sélection du commentaire", {
        description: "Veuillez réessayer plus tard."
      });
      console.error("Error selecting comment:", error);
    } finally {
      setProcessingPostId(null);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Explorer</h1>
            <p className="text-muted-foreground">
              Générez des commentaires intelligents pour vos posts LinkedIn.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/add-post">
              Ajouter un post
            </Link>
          </Button>
        </div>

        {explorePosts.length === 0 ? (
          <Card className="text-center p-6">
            <CardHeader>
              <CardTitle>Aucun post à explorer</CardTitle>
              <CardDescription>
                Ajoutez d'abord un post pour générer des commentaires.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Vous n'avez aucun post en attente de commentaires. Commencez par ajouter un post LinkedIn.
              </p>
              <Button asChild>
                <Link to="/add-post">
                  Ajouter un nouveau post
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {explorePosts.map((post) => (
              <Card key={post.id} className={post.id === activePostId ? "border-blue-500" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-xl">Post LinkedIn</span>
                    <a 
                      href={post.post_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Voir sur LinkedIn
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <p className="whitespace-pre-wrap">{post.post_content}</p>
                    </div>

                    {/* Comments section */}
                    {(post.comment_1 || post.id === processingPostId) ? (
                      <div className="space-y-4">
                        <Separator />
                        <h3 className="text-lg font-medium">Commentaires générés</h3>
                        
                        {post.id === processingPostId && isLoading ? (
                          <div className="flex items-center justify-center p-6">
                            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                            <span className="ml-3 text-muted-foreground">Génération en cours...</span>
                          </div>
                        ) : (
                          <Tabs defaultValue="comment1" className="w-full">
                            <TabsList className="grid grid-cols-3 mb-4">
                              <TabsTrigger value="comment1">Commentaire 1</TabsTrigger>
                              <TabsTrigger value="comment2">Commentaire 2</TabsTrigger>
                              <TabsTrigger value="comment3">Commentaire 3</TabsTrigger>
                            </TabsList>
                            <TabsContent value="comment1" className="space-y-4">
                              <div className="rounded-lg border p-4">
                                <p className="whitespace-pre-wrap">{post.comment_1}</p>
                              </div>
                              <Button 
                                onClick={() => handleSelectComment(post.id, 1)}
                                disabled={post.id === processingPostId}
                                className="w-full"
                              >
                                Sélectionner ce commentaire
                              </Button>
                            </TabsContent>
                            <TabsContent value="comment2" className="space-y-4">
                              <div className="rounded-lg border p-4">
                                <p className="whitespace-pre-wrap">{post.comment_2}</p>
                              </div>
                              <Button 
                                onClick={() => handleSelectComment(post.id, 2)}
                                disabled={post.id === processingPostId}
                                className="w-full"
                              >
                                Sélectionner ce commentaire
                              </Button>
                            </TabsContent>
                            <TabsContent value="comment3" className="space-y-4">
                              <div className="rounded-lg border p-4">
                                <p className="whitespace-pre-wrap">{post.comment_3}</p>
                              </div>
                              <Button 
                                onClick={() => handleSelectComment(post.id, 3)}
                                disabled={post.id === processingPostId}
                                className="w-full"
                              >
                                Sélectionner ce commentaire
                              </Button>
                            </TabsContent>
                          </Tabs>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <Button 
                          onClick={() => handleGenerateComments(post.id, post.post_content)}
                          disabled={isLoading || post.id === processingPostId}
                          size="lg"
                        >
                          {post.id === processingPostId ? "Génération en cours..." : "Générer des commentaires"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Informational Card */}
        <Card>
          <CardHeader>
            <CardTitle>Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Ajoutez un post LinkedIn</p>
                <p className="text-sm text-muted-foreground">
                  Commencez par ajouter l'URL et le contenu de votre post LinkedIn.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Générez des commentaires</p>
                <p className="text-sm text-muted-foreground">
                  Notre IA analysera votre post et créera trois commentaires engageants et pertinents.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Choisissez votre préféré</p>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez le commentaire qui vous convient le mieux et utilisez-le sur LinkedIn.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}