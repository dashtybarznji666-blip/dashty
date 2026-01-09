import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Users() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage system users and permissions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            This page is under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            User management features will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
