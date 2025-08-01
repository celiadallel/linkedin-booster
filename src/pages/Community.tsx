import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/lib/context";
import { CommunityContact } from "@/types";
import { useState } from "react";

export default function Community() {
  const { communityContacts } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CommunityContact;
    direction: 'ascending' | 'descending';
  } | null>(null);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Filter contacts based on search term
  const filteredContacts = communityContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contact.category && contact.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort contacts based on sortConfig
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const key = sortConfig.key;
    
    if (a[key] < b[key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Handle sort
  const requestSort = (key: keyof CommunityContact) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  // Get sort direction indicator
  const getSortDirection = (key: keyof CommunityContact) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Ma communauté</h1>
          <p className="text-muted-foreground">
            Gérez et suivez votre réseau LinkedIn pour maximiser votre engagement.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contacts importants</CardTitle>
            <CardDescription>
              Suivez l'engagement avec vos contacts LinkedIn les plus importants.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Rechercher par nom ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="outline">Filtrer</Button>
              </div>
              
              {sortedContacts.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => requestSort('name')}
                        >
                          Nom {getSortDirection('name')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => requestSort('category')}
                        >
                          Catégorie {getSortDirection('category')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => requestSort('interactions')}
                        >
                          Interactions {getSortDirection('interactions')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => requestSort('last_interaction_date')}
                        >
                          Dernière interaction {getSortDirection('last_interaction_date')}
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer"
                          onClick={() => requestSort('engagement_score')}
                        >
                          Score {getSortDirection('engagement_score')}
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedContacts.map((contact) => (
                        <TableRow key={contact.id}>
                          <TableCell className="font-medium">
                            <a 
                              href={contact.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 hover:underline"
                            >
                              {contact.name}
                            </a>
                          </TableCell>
                          <TableCell>{contact.category || "-"}</TableCell>
                          <TableCell>{contact.interactions}</TableCell>
                          <TableCell>{formatDate(contact.last_interaction_date)}</TableCell>
                          <TableCell>
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                contact.engagement_score > 7
                                  ? "bg-green-100 text-green-800"
                                  : contact.engagement_score > 4
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {contact.engagement_score.toFixed(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Détails
                              </Button>
                              {contact.recent_post && (
                                <Button variant="outline" size="sm" asChild>
                                  <a 
                                    href={contact.recent_post} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                  >
                                    Post récent
                                  </a>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? "Aucun contact trouvé avec ces critères" : "Aucun contact disponible"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Community Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'engagement</CardTitle>
              <CardDescription>
                Performance de vos interactions avec votre réseau
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Contacts avec engagement élevé</span>
                <span className="font-bold">{communityContacts.filter(c => c.engagement_score > 7).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Contacts avec engagement modéré</span>
                <span className="font-bold">{communityContacts.filter(c => c.engagement_score > 4 && c.engagement_score <= 7).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Contacts à renforcer</span>
                <span className="font-bold">{communityContacts.filter(c => c.engagement_score <= 4).length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Total des interactions</span>
                <span className="font-bold">{communityContacts.reduce((sum, contact) => sum + contact.interactions, 0)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suggestions</CardTitle>
              <CardDescription>
                Contacts avec lesquels renforcer vos interactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {communityContacts
                .sort((a, b) => new Date(a.last_interaction_date).getTime() - new Date(b.last_interaction_date).getTime())
                .slice(0, 3)
                .map((contact) => (
                <div key={contact.id} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Dernière interaction: {formatDate(contact.last_interaction_date)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a 
                      href={contact.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Interagir
                    </a>
                  </Button>
                </div>
              ))}
              
              {communityContacts.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Aucune suggestion disponible
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}