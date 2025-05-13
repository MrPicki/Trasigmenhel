import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LogOut, Users, BarChart } from 'lucide-react';

// Define the subscriber type
interface Subscriber {
  id: string;
  name: string;
  email: string;
  date: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [visitorStats, setVisitorStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    averageTimeOnSite: '0:00',
    todayVisits: 0
  });

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      navigate('/login');
    }

    // Load subscribers from localStorage
    const storedSubscribers = localStorage.getItem('subscribers');
    if (storedSubscribers) {
      setSubscribers(JSON.parse(storedSubscribers));
    }

    // Generate mock visitor stats
    generateMockStats();
  }, [navigate]);

  // Generate mock visitor statistics
  const generateMockStats = () => {
    const totalVisits = Math.floor(Math.random() * 1000) + 500;
    const uniqueVisitors = Math.floor(totalVisits * 0.7);
    const minutes = Math.floor(Math.random() * 5) + 1;
    const seconds = Math.floor(Math.random() * 60);
    const averageTimeOnSite = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    const todayVisits = Math.floor(Math.random() * 50) + 10;

    setVisitorStats({
      totalVisits,
      uniqueVisitors,
      averageTimeOnSite,
      todayVisits
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-charcoal-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-gray-600 hover:bg-white hover:text-charcoal-100"
          >
            <LogOut className="mr-2 h-4 w-4" /> Logga ut
          </Button>
        </div>

        <Tabs defaultValue="subscribers" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="subscribers" className="text-sm md:text-base">
              <Users className="mr-2 h-4 w-4" /> Prenumeranter
            </TabsTrigger>
            <TabsTrigger value="statistics" className="text-sm md:text-base">
              <BarChart className="mr-2 h-4 w-4" /> Statistik
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers">
            <Card className="bg-charcoal-300 border-charcoal-400">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Prenumeranter ({subscribers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {subscribers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    Inga prenumeranter ännu
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Namn</TableHead>
                          <TableHead>E-post</TableHead>
                          <TableHead>Datum</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell>{subscriber.name}</TableCell>
                            <TableCell>{subscriber.email}</TableCell>
                            <TableCell>{subscriber.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="bg-charcoal-300 border-charcoal-400">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Totala besök</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{visitorStats.totalVisits}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-charcoal-300 border-charcoal-400">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Unika besökare</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{visitorStats.uniqueVisitors}</p>
                </CardContent>
              </Card>
              
              <Card className="bg-charcoal-300 border-charcoal-400">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Genomsnittlig tid på sidan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{visitorStats.averageTimeOnSite} min</p>
                </CardContent>
              </Card>
              
              <Card className="bg-charcoal-300 border-charcoal-400">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Besök idag</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{visitorStats.todayVisits}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-charcoal-300 border-charcoal-400">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Besöksstatistik</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <p className="text-gray-400">
                  För att implementera faktisk besöksstatistik, rekommenderar vi att integrera med Google Analytics eller liknande verktyg.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
