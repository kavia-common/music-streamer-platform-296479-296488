# Add to Playlist Feature - Testing Guide

## Feature Overview
The add-to-playlist feature allows users to add Audius tracks to their playlists directly from the main home page (trending or search results).

## What Was Implemented

### 1. Toast Notification System (`src/utils/toast.js`)
- **Success toasts**: Green background with checkmark icon
- **Error toasts**: Red background with X icon  
- **Info toasts**: Blue background with info icon
- Auto-dismiss after 3-4 seconds
- Positioned at top-right of screen
- Supports manual close button

### 2. API Integration (`src/api/apiClient.js`)
- New `addTrackToPlaylist(playlistId, trackData)` function
- Validates required fields before making request
- Uses existing `REACT_APP_BACKEND_URL` configuration
- Sends track data: title, duration_seconds, audius_track_id, audius_stream_url
- Proper authentication with Bearer token

### 3. UI Updates (`src/pages/MainHome.js`)
- Each track now has a "+" button in the rightmost column
- Clicking "+" opens a popover with user's playlists
- Loading state while adding track (button shows "...")
- All interactions disabled during add operation
- Popover closes automatically on success
- Handles duplicate tracks gracefully (shows success message)

### 4. Styling Updates (`src/pages/AddToPlaylist.css`)
- Disabled button states (grayed out, not clickable)
- Loading state opacity
- Consistent Ocean Professional theme colors

## Testing Steps

### Prerequisites
1. User must be logged in
2. User should have at least one playlist created (use sidebar "+" button)
3. Backend must be running at the configured URL

### Test Case 1: Successfully Add Track to Playlist
1. Navigate to home page
2. View trending tracks or search for tracks
3. Locate the "+" button on any track row (rightmost column)
4. Click the "+" button
5. **Expected**: Popover opens showing "Add to playlist" header and list of playlists
6. Click on any playlist name
7. **Expected**: 
   - Button changes to "..." briefly
   - Popover closes
   - Green success toast appears: "[Track Title] added to [Playlist Name]"

### Test Case 2: Add Duplicate Track
1. Add a track to a playlist (follow Test Case 1)
2. Try to add the same track to the same playlist again
3. **Expected**: 
   - Green success toast appears: "[Track Title] is already in [Playlist Name]"
   - No error shown (graceful handling)

### Test Case 3: No Playlists Available
1. Ensure user has no playlists (delete all if any exist)
2. Click "+" on any track
3. **Expected**: Popover shows "No playlists yet" message

### Test Case 4: Loading States
1. Click "+" on a track
2. **Expected**: Popover shows "Loading playlists..." while fetching
3. After playlists load, click a playlist
4. **Expected**: 
   - Button text changes to "..."
   - Button becomes disabled (grayed out)
   - Popover header changes to "Adding track..."
   - All playlist buttons become disabled

### Test Case 5: Error Handling
1. Stop the backend server
2. Try to add a track to a playlist
3. **Expected**: Red error toast with error message
4. Restart backend and try again
5. **Expected**: Success toast appears

### Test Case 6: Keyboard Accessibility
1. Use Tab key to navigate to "+" button
2. Press Enter or Space to open popover
3. Press Escape to close popover
4. **Expected**: All keyboard interactions work smoothly

### Test Case 7: Click Outside to Close
1. Click "+" to open popover
2. Click anywhere outside the popover
3. **Expected**: Popover closes

## Technical Details

### Backend Endpoint
- **URL**: `POST /api/playlists/:playlistId/items`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "title": "Track Title",
    "duration_seconds": 180,
    "audius_track_id": "abc123",
    "audius_stream_url": "https://discoveryprovider.audius.co/v1/tracks/abc123/stream?app_name=spotify-clone"
  }
  ```

### Stream URL Format
The Audius stream URL is constructed as:
```
https://discoveryprovider.audius.co/v1/tracks/{track.id}/stream?app_name={APP_NAME}
```

### Environment Variables Used
- `REACT_APP_BACKEND_URL`: Backend API base URL
- `REACT_APP_AUDIUS_APP_NAME`: Audius app name (defaults to 'spotify-clone')

## Known Behaviors

1. **Duplicate Track Handling**: If a track already exists in the playlist, the system shows a success message instead of an error to provide a non-blocking user experience.

2. **Toast Auto-Dismiss**: Success toasts auto-dismiss after 3 seconds, error toasts after 4 seconds.

3. **Single Request at a Time**: The system prevents multiple simultaneous add operations to avoid race conditions.

4. **Validation**: Basic input validation ensures all required fields are present before making the API request.

## Troubleshooting

### Issue: Popover doesn't show playlists
- Check if user is authenticated
- Verify backend is running and accessible
- Check browser console for errors

### Issue: "Failed to add track" error
- Verify backend endpoint is working: `POST /api/playlists/:playlistId/items`
- Check network tab in browser dev tools
- Verify authentication token is valid

### Issue: Toast notifications not appearing
- Check if toast container is being created in DOM
- Look for JavaScript errors in console
- Verify `showSuccess` and `showError` functions are imported

### Issue: Button stays disabled
- This shouldn't happen, but if it does, refresh the page
- Check console for JavaScript errors in the add operation
