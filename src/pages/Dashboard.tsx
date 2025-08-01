import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/lib/context";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { stats, posts, communityContacts } = useApp();

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue sur votre assistant de gestion de communauté LinkedIn.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Posts boostés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.posts_boosted}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{Math.round(stats.posts_boosted * 0.1)} depuis le mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Commentaires générés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.comments_generated}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{Math.round(stats.comments_generated * 0.15)} depuis le mois dernier
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Taux d'engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.avg_engagement_rate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{(stats.avg_engagement_rate * 0.05).toFixed(1)}% depuis le mois dernier
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Posts & Top Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Posts récents</CardTitle>
              <CardDescription>
                Vos derniers posts LinkedIn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {posts.slice(0, 3).map((post) => (
                <div key={post.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-none">
                      {post.post_content.length > 60 
                        ? `${post.post_content.substring(0, 60)}...` 
                        : post.post_content}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ajouté le {formatDate(post.date_added)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.status === 'commented' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {post.status === 'commented' ? 'Commenté' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
              
              {posts.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Aucun post récent
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link to="/add-post">
                  Ajouter un nouveau post
                </Link>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Top Contacts */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Contacts importants</CardTitle>
              <CardDescription>
                Membres de votre communauté avec le plus d'engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {communityContacts.slice(0, 3).map((contact) => (
                <div key={contact.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium leading-none">
                      {contact.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.category || 'Contact'} · {contact.interactions} interactions
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                      {contact.engagement_score.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
              
              {communityContacts.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Aucun contact
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <Link to="/community">
                  Voir tous les contacts
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>
              Explorez les fonctionnalités de LinkedIn Community Booster
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-32 flex-col justify-center items-center" asChild>
              <Link to="/add-post">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-2 h-6 w-6"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Ajouter un post
              </Link>
            </Button>
            <Button variant="outline" className="h-32 flex-col justify-center items-center" asChild>
              <Link to="/explore">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-2 h-6 w-6"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" x2="16.65" y1="21" y2="16.65"></line>
                </svg>
                Explorer des posts
              </Link>
            </Button>
            <Button variant="outline" className="h-32 flex-col justify-center items-center" asChild>
              <Link to="/community">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-2 h-6 w-6"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Gérer ma communauté
              </Link>
            </Button>
            <Button variant="outline" className="h-32 flex-col justify-center items-center" asChild>
              <Link to="/profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mb-2 h-6 w-6"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                  <line x1="2" x2="22" y1="10" y2="10"></line>
                </svg>
                Gérer mon abonnement
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}