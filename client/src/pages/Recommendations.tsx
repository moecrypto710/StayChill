import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useTranslation } from '@/lib/translations';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Save, Heart, Eye, RefreshCw } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
// Import PropertyCard component
import PropertyCard from '@/components/PropertyCard';
// Import EmptyState component  
import EmptyState from '@/components/EmptyState';

// Define the preferences schema
const preferencesSchema = z.object({
  budget: z.enum(['low', 'medium', 'high']),
  travelStyle: z.array(z.string()).min(1, 'Please select at least one travel style'),
  preferredActivities: z.array(z.string()),
  destinationTypes: z.array(z.string()),
  familyFriendly: z.boolean().default(false),
  accessibility: z.boolean().default(false),
  seasonalPreference: z.enum(['summer', 'winter', 'spring', 'fall', 'any']),
  tripDuration: z.enum(['weekend', 'week', 'two_weeks', 'month', 'longer']),
  maxDistance: z.number().min(0).max(1000)
});

// Type for form data
type TravelPreferencesFormValues = z.infer<typeof preferencesSchema>;

export default function Recommendations() {
  const { t, isRtl } = useTranslation();
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('preferences');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [savedRecommendations, setSavedRecommendations] = useState<any[]>([]);
  const [viewedRecommendations, setViewedRecommendations] = useState<any[]>([]);
  const [hasPreferences, setHasPreferences] = useState(false);

  // Initialize form with default values
  const defaultValues: TravelPreferencesFormValues = {
    budget: 'medium',
    travelStyle: ['relaxation'],
    preferredActivities: ['swimming', 'dining'],
    destinationTypes: ['beach'],
    familyFriendly: false,
    accessibility: false,
    seasonalPreference: 'summer',
    tripDuration: 'week',
    maxDistance: 200
  };

  // Define form
  const form = useForm<TravelPreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues
  });

  // Load user preferences on mount
  useEffect(() => {
    async function loadUserPreferences() {
      if (!user) return;

      try {
        const res = await apiRequest('GET', '/api/user/preferences');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            form.reset({
              budget: data.budget,
              travelStyle: data.travelStyle,
              preferredActivities: data.preferredActivities,
              destinationTypes: data.destinationTypes,
              familyFriendly: data.familyFriendly,
              accessibility: data.accessibility,
              seasonalPreference: data.seasonalPreference,
              tripDuration: data.tripDuration,
              maxDistance: data.maxDistance
            });
            setHasPreferences(true);
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }

    // Load recommendations
    async function loadRecommendations() {
      if (!user) return;

      try {
        // New recommendations
        const resNew = await apiRequest('GET', '/api/recommendations/new');
        if (resNew.ok) {
          const newRecs = await resNew.json();
          setRecommendations(newRecs);
        }

        // Saved recommendations
        const resSaved = await apiRequest('GET', '/api/recommendations/saved');
        if (resSaved.ok) {
          const savedRecs = await resSaved.json();
          setSavedRecommendations(savedRecs);
        }

        // Viewed recommendations
        const resViewed = await apiRequest('GET', '/api/recommendations/viewed');
        if (resViewed.ok) {
          const viewedRecs = await resViewed.json();
          setViewedRecommendations(viewedRecs);
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
      }
    }

    loadUserPreferences();
    loadRecommendations();
  }, [user, form]);

  // Save preferences
  const onSubmit = async (data: TravelPreferencesFormValues) => {
    if (!user) return;

    setIsSaving(true);
    try {
      const res = await apiRequest('POST', '/api/user/preferences', {
        ...data,
        userId: user.id
      });

      if (res.ok) {
        setHasPreferences(true);
        toast({
          title: t('preferences_saved'),
          description: t('preferences_saved_desc'),
          variant: 'default',
        });
      } else {
        throw new Error('Failed to save preferences');
      }
    } catch (error) {
      toast({
        title: t('error_saving_preferences'),
        description: t('try_again_later'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Generate new recommendations
  const generateRecommendations = async () => {
    if (!user || !hasPreferences) return;

    setIsGenerating(true);
    try {
      const res = await apiRequest('POST', '/api/recommendations/generate');

      if (res.ok) {
        const newRecs = await res.json();
        setRecommendations(newRecs);
        toast({
          title: t('recommendations_generated'),
          description: t('recommendations_generated_desc'),
          variant: 'default',
        });
        setActiveTab('recommended');
      } else {
        throw new Error('Failed to generate recommendations');
      }
    } catch (error) {
      toast({
        title: t('error_generating_recommendations'),
        description: t('try_again_later'),
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle saving a recommendation
  const saveRecommendation = async (id: number, isSaved: boolean) => {
    if (!user) return;

    try {
      const res = await apiRequest('POST', `/api/recommendations/${id}/save`, {
        saved: isSaved
      });

      if (res.ok) {
        if (isSaved) {
          // Add to saved, update recommendations
          const rec = recommendations.find(r => r.id === id);
          if (rec) {
            setSavedRecommendations(prev => [...prev, {...rec, saved: true}]);
            setRecommendations(prev => prev.filter(rec => rec.id !== id));
          }
        } else {
          // Remove from saved, add back to recommendations
          const rec = savedRecommendations.find(r => r.id === id);
          if (rec) {
            setRecommendations(prev => [...prev, {...rec, saved: false}]);
            setSavedRecommendations(prev => prev.filter(rec => rec.id !== id));
          }
        }
      } else {
        throw new Error('Failed to update recommendation');
      }
    } catch (error) {
      toast({
        title: t('error_saving_recommendation'),
        description: t('try_again_later'),
        variant: 'destructive',
      });
    }
  };

  // Travel style options
  const travelStyleOptions = [
    { value: 'relaxation', label: 'Relaxation' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'culture', label: 'Cultural Experience' },
    { value: 'romantic', label: 'Romantic Getaway' },
    { value: 'business', label: 'Business Travel' },
    { value: 'solo', label: 'Solo Travel' },
    { value: 'eco', label: 'Eco-friendly' },
    { value: 'luxury', label: 'Luxury' }
  ];

  // Activity options
  const activityOptions = [
    { value: 'swimming', label: 'Swimming' },
    { value: 'hiking', label: 'Hiking' },
    { value: 'dining', label: 'Fine Dining' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'sightseeing', label: 'Sightseeing' },
    { value: 'nightlife', label: 'Nightlife' },
    { value: 'spa', label: 'Spa & Wellness' },
    { value: 'sports', label: 'Water Sports' }
  ];

  // Destination type options
  const destinationOptions = [
    { value: 'beach', label: 'Beach' },
    { value: 'city', label: 'City' },
    { value: 'mountain', label: 'Mountain' },
    { value: 'countryside', label: 'Countryside' },
    { value: 'desert', label: 'Desert' },
    { value: 'lake', label: 'Lake' },
    { value: 'island', label: 'Island' },
    { value: 'resort', label: 'Resort' }
  ];

  // Handle error states
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">{t('oops_something_went_wrong')}</h2>
          <p className="text-muted-foreground mb-4">{t('error_loading_recommendations')}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            {t('refresh')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-2 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t('personalized_recommendations')}</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 w-full sm:w-auto">
          <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
          <TabsTrigger value="recommended">{t('recommended')}</TabsTrigger>
          <TabsTrigger value="saved">{t('saved')}</TabsTrigger>
          <TabsTrigger value="viewed">{t('viewed')}</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t('travel_preferences')}</CardTitle>
              <CardDescription>
                {t('travel_preferences_desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-6">
                    {/* Budget Selection */}
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('budget')}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('select_budget')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">{t('budget_low')}</SelectItem>
                              <SelectItem value="medium">{t('budget_medium')}</SelectItem>
                              <SelectItem value="high">{t('budget_high')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Travel Style */}
                    <FormField
                      control={form.control}
                      name="travelStyle"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">{t('travel_style')}</FormLabel>
                            <FormDescription>
                              {t('select_all_that_apply')}
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {travelStyleOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={form.control}
                                name="travelStyle"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, option.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.value
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Preferred Activities */}
                    <FormField
                      control={form.control}
                      name="preferredActivities"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">{t('preferred_activities')}</FormLabel>
                            <FormDescription>
                              {t('select_all_that_apply')}
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {activityOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={form.control}
                                name="preferredActivities"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, option.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.value
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Destination Types */}
                    <FormField
                      control={form.control}
                      name="destinationTypes"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">{t('destination_types')}</FormLabel>
                            <FormDescription>
                              {t('select_all_that_apply')}
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {destinationOptions.map((option) => (
                              <FormField
                                key={option.value}
                                control={form.control}
                                name="destinationTypes"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={option.value}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(option.value)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, option.value])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== option.value
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {option.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Family Friendly */}
                    <FormField
                      control={form.control}
                      name="familyFriendly"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">{t('family_friendly')}</FormLabel>
                            <FormDescription>
                              {t('family_friendly_desc')}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Accessibility Needs */}
                    <FormField
                      control={form.control}
                      name="accessibility"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">{t('accessibility_needs')}</FormLabel>
                            <FormDescription>
                              {t('accessibility_needs_desc')}
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Seasonal Preference */}
                    <FormField
                      control={form.control}
                      name="seasonalPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('seasonal_preference')}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('select_season')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="summer">{t('summer')}</SelectItem>
                              <SelectItem value="winter">{t('winter')}</SelectItem>
                              <SelectItem value="spring">{t('spring')}</SelectItem>
                              <SelectItem value="fall">{t('fall')}</SelectItem>
                              <SelectItem value="any">{t('any_season')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Trip Duration */}
                    <FormField
                      control={form.control}
                      name="tripDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('trip_duration')}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('select_duration')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekend">{t('weekend')}</SelectItem>
                              <SelectItem value="week">{t('week')}</SelectItem>
                              <SelectItem value="two_weeks">{t('two_weeks')}</SelectItem>
                              <SelectItem value="month">{t('month')}</SelectItem>
                              <SelectItem value="longer">{t('longer')}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Max Distance */}
                    <FormField
                      control={form.control}
                      name="maxDistance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('max_distance_km')}</FormLabel>
                          <div className="px-1">
                            <Slider
                              min={0}
                              max={1000}
                              step={10}
                              defaultValue={[field.value]}
                              onValueChange={(values) => field.onChange(values[0])}
                              className="py-4"
                            />
                          </div>
                          <div className="flex justify-between">
                            <FormDescription>
                              {t('max_distance_desc')}
                            </FormDescription>
                            <span className="font-medium">{field.value} km</span>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>{t('saving')}...</>
                      ) : (
                        <>{t('save_preferences')}</>
                      )}
                    </Button>
                    
                    {hasPreferences && (
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={generateRecommendations}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>{t('generating')}...</>
                        ) : (
                          <>{t('get_new_recommendations')}</>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommended">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">{t('set_travel_preferences')}</h2>
            <p className="text-muted-foreground">
              {t('set_travel_preferences_desc')}
            </p>
            {!hasPreferences && (
              <Button 
                onClick={() => setActiveTab('preferences')} 
                className="mt-3"
              >
                {t('set_preferences')}
              </Button>
            )}
          </div>

          <Tabs defaultValue="recommended">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="recommended">{t('recommended')}</TabsTrigger>
              <TabsTrigger value="saved">{t('saved')}</TabsTrigger>
              <TabsTrigger value="viewed">{t('viewed')}</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended">
              {recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec) => (
                    <RecommendationCard 
                      key={rec.id} 
                      recommendation={rec} 
                      onSave={() => saveRecommendation(rec.id, true)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={t('no_new_recommendations')}
                  description={t('no_new_recommendations_desc')}
                  icon={<RefreshCw className="h-10 w-10 text-muted-foreground" />}
                  action={
                    hasPreferences ? (
                      <Button
                        onClick={generateRecommendations}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <>{t('generating')}...</>
                        ) : (
                          <>{t('generate_recommendations')}</>
                        )}
                      </Button>
                    ) : (
                      <Button onClick={() => setActiveTab('preferences')}>
                        {t('set_preferences')}
                      </Button>
                    )
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="saved">
              {savedRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedRecommendations.map((rec) => (
                    <RecommendationCard 
                      key={rec.id} 
                      recommendation={rec} 
                      onSave={() => saveRecommendation(rec.id, false)}
                      isSaved
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={t('no_saved_recommendations')}
                  description={t('no_saved_recommendations_desc')}
                  icon={<Heart className="h-10 w-10 text-muted-foreground" />}
                />
              )}
            </TabsContent>

            <TabsContent value="viewed">
              {viewedRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {viewedRecommendations.map((rec) => (
                    <RecommendationCard 
                      key={rec.id} 
                      recommendation={rec} 
                      onSave={() => saveRecommendation(rec.id, true)}
                      isViewed
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title={t('no_viewed_recommendations')}
                  description={t('no_viewed_recommendations_desc')}
                  icon={<Eye className="h-10 w-10 text-muted-foreground" />}
                />
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="saved">
          {savedRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecommendations.map((rec) => (
                <RecommendationCard 
                  key={rec.id} 
                  recommendation={rec} 
                  onSave={() => saveRecommendation(rec.id, false)}
                  isSaved
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('no_saved_recommendations')}
              description={t('no_saved_recommendations_desc')}
              icon={<Heart className="h-10 w-10 text-muted-foreground" />}
            />
          )}
        </TabsContent>

        <TabsContent value="viewed">
          {viewedRecommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {viewedRecommendations.map((rec) => (
                <RecommendationCard 
                  key={rec.id} 
                  recommendation={rec} 
                  onSave={() => saveRecommendation(rec.id, true)}
                  isViewed
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t('no_viewed_recommendations')}
              description={t('no_viewed_recommendations_desc')}
              icon={<Eye className="h-10 w-10 text-muted-foreground" />}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RecommendationCard({ 
  recommendation, 
  onSave, 
  isSaved = false,
  isViewed = false 
}: { 
  recommendation: any; 
  onSave: () => void;
  isSaved?: boolean;
  isViewed?: boolean;
}) {
  const { t, isRtl } = useTranslation();
  const matchPercentage = recommendation.matchPercentage || 85;

  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="secondary" className="font-semibold bg-opacity-90">
            {t('match')}: {matchPercentage}%
          </Badge>
        </div>
        
        <PropertyCard
          property={recommendation.property}
          minimalView
        />
      </div>
      
      <CardContent className="p-4">
        <CardDescription className="mb-4">
          {recommendation.reason || t('recommendation_default_reason')}
        </CardDescription>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {recommendation.property.amenities.slice(0, 3).map((amenity: string) => (
            <Badge key={amenity} variant="outline">
              {amenity}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0">
        {isViewed ? (
          <Button variant="outline" className="w-full" onClick={onSave}>
            <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current text-destructive' : ''}`} />
            {t('view_again')}
          </Button>
        ) : (
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="w-1/2" asChild>
              <a href={`/property/${recommendation.property.id}`}>
                {t('view_details')}
              </a>
            </Button>
            <Button 
              variant={isSaved ? "default" : "secondary"} 
              className="w-1/2" 
              onClick={onSave}
            >
              <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? t('saved') : t('save')}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

// RecommendationCard component at the bottom of the file