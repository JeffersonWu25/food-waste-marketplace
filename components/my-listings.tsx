import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface FeedListing {
    id: string
    feed_type: string
    amount: number
    price: number
    created_at: string
}

export function MyListings() {
    const [listings, setListings] = useState<FeedListing[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data, error } = await supabase
                    .from('feeds')
                    .select('*')
                    .eq('store_id', user.id)
                    .order('created_at', { ascending: false })

                if (error) throw error
                setListings(data || [])
            } catch (error) {
                console.error('Error fetching listings:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchListings()
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Feed Listings</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Feed Type</TableHead>
                                <TableHead>Amount (lbs)</TableHead>
                                <TableHead>Price ($)</TableHead>
                                <TableHead>Listed On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {listings.map((listing) => (
                                <TableRow key={listing.id}>
                                    <TableCell className="capitalize">{listing.feed_type}</TableCell>
                                    <TableCell>{listing.amount}</TableCell>
                                    <TableCell>${listing.price.toFixed(2)}</TableCell>
                                    <TableCell>{new Date(listing.created_at).toLocaleDateString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
} 