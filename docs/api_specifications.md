# API Specifications - LinkedIn Community Booster

## Base URL
```
https://api.linkedinbooster.app/v1
```

## Authentication
Toutes les requêtes API nécessitent une authentification par JWT (JSON Web Token).

**Headers requis:**
```
Authorization: Bearer <token>
```

## Format des réponses
Toutes les réponses sont en format JSON avec la structure suivante:

**Succès:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Erreur:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description de l'erreur"
  }
}
```

## Endpoints API

### Authentification

#### POST /auth/register
Inscription d'un nouvel utilisateur.

**Requête:**
```json
{
  "email": "utilisateur@example.com",
  "password": "motDePasseSecurisé",
  "name": "Nom Utilisateur"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-utilisateur",
    "token": "jwt-token",
    "expiresIn": 86400
  },
  "message": "Compte créé avec succès"
}
```

#### POST /auth/login
Connexion d'un utilisateur existant.

**Requête:**
```json
{
  "email": "utilisateur@example.com",
  "password": "motDePasseSecurisé"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "userId": "uuid-utilisateur",
    "token": "jwt-token",
    "expiresIn": 86400,
    "name": "Nom Utilisateur"
  },
  "message": "Connexion réussie"
}
```

### Posts

#### POST /posts
Ajoute un nouveau post LinkedIn à analyser.

**Requête:**
```json
{
  "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:1234567890",
  "postContent": "Contenu du post LinkedIn"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "postId": "uuid-post",
    "dateAdded": "2025-07-31T14:30:00Z"
  },
  "message": "Post ajouté avec succès"
}
```

#### GET /posts
Récupère tous les posts de l'utilisateur.

**Paramètres de requête:**
- `page` (optionnel): Numéro de page (par défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (par défaut: 10)
- `status` (optionnel): Filtre par statut ("pending", "commented", "skipped")

**Réponse:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid-post-1",
        "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:1234567890",
        "postContent": "Contenu du post LinkedIn 1",
        "dateAdded": "2025-07-31T14:30:00Z",
        "status": "commented",
        "selectedComment": 2
      },
      {
        "id": "uuid-post-2",
        "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:9876543210",
        "postContent": "Contenu du post LinkedIn 2",
        "dateAdded": "2025-07-30T10:15:00Z",
        "status": "pending",
        "selectedComment": null
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "pages": 3
    }
  },
  "message": "Posts récupérés avec succès"
}
```

#### GET /posts/:postId
Récupère les détails d'un post spécifique.

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-post",
    "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:1234567890",
    "postContent": "Contenu du post LinkedIn",
    "dateAdded": "2025-07-31T14:30:00Z",
    "comment1": "Commentaire persona tech-savvy",
    "comment2": "Commentaire persona recruteur",
    "comment3": "Commentaire persona support",
    "selectedComment": 2,
    "status": "commented",
    "engagementMetrics": {
      "likes": 15,
      "comments": 7,
      "shares": 3
    }
  },
  "message": "Détails du post récupérés avec succès"
}
```

#### POST /posts/:postId/comments/generate
Génère des commentaires IA pour un post spécifique.

**Réponse:**
```json
{
  "success": true,
  "data": {
    "comments": [
      "Très intéressante utilisation de la technologie blockchain pour résoudre ce problème de traçabilité. Les implications pour la cybersécurité sont considérables.",
      "En tant que recruteur, je vois énormément de candidats mentionner ces compétences sur leur CV. C'est définitivement un domaine en pleine croissance!",
      "Merci pour ce partage ! J'ai rencontré des défis similaires dans mon entreprise, et votre approche offre une perspective rafraîchissante."
    ]
  },
  "message": "Commentaires générés avec succès"
}
```

#### PUT /posts/:postId/comments/select
Sélectionne un commentaire à utiliser.

**Requête:**
```json
{
  "commentIndex": 2
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "selectedComment": "En tant que recruteur, je vois énormément de candidats mentionner ces compétences sur leur CV. C'est définitivement un domaine en pleine croissance!",
    "status": "commented"
  },
  "message": "Commentaire sélectionné avec succès"
}
```

### Communauté

#### GET /community
Récupère la liste des contacts de l'utilisateur.

**Paramètres de requête:**
- `page` (optionnel): Numéro de page (par défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (par défaut: 10)
- `sort` (optionnel): Champ de tri ("name", "interactions", "lastInteraction")
- `order` (optionnel): Ordre de tri ("asc", "desc")

**Réponse:**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": "uuid-contact-1",
        "name": "Jean Dupont",
        "linkedinUrl": "https://www.linkedin.com/in/jean-dupont",
        "interactions": 15,
        "recentPost": "https://www.linkedin.com/feed/update/urn:li:activity:1234567890",
        "lastInteractionDate": "2025-07-25T09:45:00Z",
        "engagementScore": 8.5,
        "category": "Prospect"
      },
      {
        "id": "uuid-contact-2",
        "name": "Marie Martin",
        "linkedinUrl": "https://www.linkedin.com/in/marie-martin",
        "interactions": 7,
        "recentPost": "https://www.linkedin.com/feed/update/urn:li:activity:9876543210",
        "lastInteractionDate": "2025-07-20T14:30:00Z",
        "engagementScore": 6.2,
        "category": "Collègue"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "pages": 5
    }
  },
  "message": "Contacts récupérés avec succès"
}
```

#### POST /community
Ajoute un nouveau contact.

**Requête:**
```json
{
  "name": "Pierre Dubois",
  "linkedinUrl": "https://www.linkedin.com/in/pierre-dubois",
  "notes": "Rencontré au salon de l'innovation",
  "category": "Prospect"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-contact",
    "name": "Pierre Dubois",
    "linkedinUrl": "https://www.linkedin.com/in/pierre-dubois",
    "category": "Prospect"
  },
  "message": "Contact ajouté avec succès"
}
```

#### PUT /community/:contactId
Met à jour les informations d'un contact.

**Requête:**
```json
{
  "notes": "Mis à jour après réunion du 15/08",
  "category": "Client"
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-contact",
    "name": "Pierre Dubois",
    "notes": "Mis à jour après réunion du 15/08",
    "category": "Client"
  },
  "message": "Contact mis à jour avec succès"
}
```

#### GET /community/suggestions
Récupère des suggestions de contacts à réengager.

**Réponse:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "contactId": "uuid-contact-1",
        "name": "Jean Dupont",
        "lastInteraction": "2025-06-01T10:30:00Z",
        "suggestedAction": "Commenter son dernier post sur l'IA",
        "priority": "high"
      },
      {
        "contactId": "uuid-contact-2",
        "name": "Marie Martin",
        "lastInteraction": "2025-06-15T14:45:00Z",
        "suggestedAction": "Féliciter pour sa promotion récente",
        "priority": "medium"
      }
    ]
  },
  "message": "Suggestions générées avec succès"
}
```

### Agents

#### GET /agents
Récupère la liste des agents de l'utilisateur.

**Réponse:**
```json
{
  "success": true,
  "data": {
    "agents": [
      {
        "id": "uuid-agent-1",
        "agentName": "Tech Expert",
        "lastActivity": "2025-07-30T09:15:00Z",
        "dailyCommentCount": 3,
        "dailyLimit": 10
      },
      {
        "id": "uuid-agent-2",
        "agentName": "Senior Recruiter",
        "lastActivity": "2025-07-29T16:45:00Z",
        "dailyCommentCount": 5,
        "dailyLimit": 10
      }
    ]
  },
  "message": "Agents récupérés avec succès"
}
```

#### POST /agents
Crée un nouvel agent.

**Requête:**
```json
{
  "agentName": "Marketing Specialist",
  "dailyLimit": 15
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-agent",
    "agentName": "Marketing Specialist",
    "dailyLimit": 15
  },
  "message": "Agent créé avec succès"
}
```

### Analytics

#### GET /analytics/dashboard
Récupère les données du tableau de bord.

**Paramètres de requête:**
- `period` (optionnel): Période d'analyse ("day", "week", "month", "year")

**Réponse:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "postsBoosted": 42,
      "commentsGenerated": 126,
      "avgEngagementRate": 7.8
    },
    "trends": {
      "engagementRate": [
        {"date": "2025-07-25", "value": 6.5},
        {"date": "2025-07-26", "value": 7.2},
        {"date": "2025-07-27", "value": 7.8},
        {"date": "2025-07-28", "value": 8.1},
        {"date": "2025-07-29", "value": 7.9},
        {"date": "2025-07-30", "value": 8.3},
        {"date": "2025-07-31", "value": 8.7}
      ],
      "commentsPerDay": [
        {"date": "2025-07-25", "value": 4},
        {"date": "2025-07-26", "value": 5},
        {"date": "2025-07-27", "value": 3},
        {"date": "2025-07-28", "value": 7},
        {"date": "2025-07-29", "value": 6},
        {"date": "2025-07-30", "value": 8},
        {"date": "2025-07-31", "value": 9}
      ]
    },
    "topPerformingComment": "En tant que professionnel tech, je trouve que votre analyse des tendances en IA est particulièrement pertinente. Le point sur l'éthique est crucial."
  },
  "message": "Données d'analyse récupérées avec succès"
}
```

#### GET /analytics/reports
Génère un rapport d'activité.

**Paramètres de requête:**
- `startDate`: Date de début (YYYY-MM-DD)
- `endDate`: Date de fin (YYYY-MM-DD)
- `format` (optionnel): Format du rapport ("json", "csv", "pdf")

**Réponse:**
```json
{
  "success": true,
  "data": {
    "reportUrl": "https://api.linkedinbooster.app/reports/user-uuid/report-2025-07.pdf",
    "expiresAt": "2025-08-07T00:00:00Z"
  },
  "message": "Rapport généré avec succès"
}
```

### Explorateur de Posts

#### GET /explorer/posts
Récupère des posts recommandés à commenter.

**Paramètres de requête:**
- `page` (optionnel): Numéro de page (par défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (par défaut: 10)
- `filter` (optionnel): Filtres spécifiques ("trending", "network", "industry")

**Réponse:**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "postId": "unique-id-1",
        "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:1234567890",
        "authorName": "Jean Dupont",
        "authorPosition": "CTO at Tech Company",
        "postSnippet": "Les premiers mots du post...",
        "engagementScore": 8.7,
        "publishedAt": "2025-07-30T10:15:00Z",
        "relevanceScore": 0.92
      },
      {
        "postId": "unique-id-2",
        "postUrl": "https://www.linkedin.com/feed/update/urn:li:activity:9876543210",
        "authorName": "Marie Martin",
        "authorPosition": "Head of Marketing at Brand Inc",
        "postSnippet": "Les premiers mots du post...",
        "engagementScore": 7.5,
        "publishedAt": "2025-07-31T08:30:00Z",
        "relevanceScore": 0.85
      }
    ],
    "pagination": {
      "total": 37,
      "page": 1,
      "limit": 10,
      "pages": 4
    }
  },
  "message": "Posts explorés avec succès"
}
```

### Settings

#### GET /settings
Récupère les paramètres de l'utilisateur.

**Réponse:**
```json
{
  "success": true,
  "data": {
    "commentPreferences": {
      "defaultPersonas": ["Tech Expert", "Senior Recruiter", "Peer Support"],
      "maxLength": 100,
      "tone": "professional"
    },
    "notifications": {
      "email": true,
      "browser": true,
      "frequency": "daily"
    },
    "privacy": {
      "shareAnalytics": false,
      "savePostHistory": true,
      "retentionPeriod": 90
    }
  },
  "message": "Paramètres récupérés avec succès"
}
```

#### PUT /settings
Met à jour les paramètres de l'utilisateur.

**Requête:**
```json
{
  "commentPreferences": {
    "tone": "casual"
  },
  "notifications": {
    "frequency": "weekly"
  }
}
```

**Réponse:**
```json
{
  "success": true,
  "data": {
    "updated": ["commentPreferences.tone", "notifications.frequency"]
  },
  "message": "Paramètres mis à jour avec succès"
}
```

## Codes d'erreur

| Code | Message | Description |
|------|---------|-------------|
| `AUTH_REQUIRED` | Authentication required | L'utilisateur n'est pas authentifié |
| `INVALID_CREDENTIALS` | Invalid credentials | Les identifiants sont incorrects |
| `RESOURCE_NOT_FOUND` | Resource not found | La ressource demandée n'existe pas |
| `VALIDATION_ERROR` | Validation error | Les données soumises sont invalides |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded | Limite de requêtes dépassée |
| `INSUFFICIENT_PERMISSIONS` | Insufficient permissions | L'utilisateur n'a pas les autorisations nécessaires |
| `INTERNAL_SERVER_ERROR` | Internal server error | Erreur interne du serveur |
| `LINKEDIN_API_ERROR` | LinkedIn API error | Erreur lors de l'interaction avec LinkedIn |
| `AI_SERVICE_ERROR` | AI service error | Erreur du service d'IA |
| `INVALID_POST_URL` | Invalid LinkedIn post URL | L'URL du post LinkedIn est invalide |